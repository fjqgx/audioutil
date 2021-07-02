
import { ErrorCode } from "../error";
import { BasePlayer, PlayerState } from "./baseplayer";


export class AudioBufferPlayer extends BasePlayer {

  protected arrayBuffer?: AudioBuffer;
  protected playbackTime: number = 0;
  protected offsetTime: number = 0;

  constructor() {
    super();    
  }

  get isPlaying (): boolean {
    return this.playerState === PlayerState.Playing || this.playerState === PlayerState.Loading;
  }

  /**
   * 获取音频长度
   */
  get duration (): number {
    let node: AudioBufferSourceNode = this.sourceNode as AudioBufferSourceNode;
    if (node && node.buffer) {
      return Math.round(node.buffer.duration * 1000);
    }
    return -1;
  }

  set currentTime (value: number) {
    if (this.sourceNode && this.arrayBuffer) {
      this.playbackTime = value / 1000;
      if (value < 0) {
        this.emit("error", {
          code: ErrorCode.ERROR_PLAYTIME_ERROR,
          reason: "currentTime out of range"
        })
      } else if (value >= this.duration) {
        this.stop();
        this.playerState = PlayerState.End;
        this.emit("ended");
      } else {
        this.stop();
        this.initPlay(this.arrayBuffer);
      }
    } 
  }

  get currentTime (): number {
    let node: AudioBufferSourceNode = this.sourceNode as AudioBufferSourceNode;
    if (node && node.context && (PlayerState.Playing === this.playerState || PlayerState.Pause === this.playerState)) {
      let cTime: number = Math.round((node.context.currentTime - this.offsetTime + this.playbackTime) * 1000);
      
      return cTime > this.duration ? this.duration : cTime;
    }
    return -1;
  }

  set playbackRate (rate: number) {
    if (this.sourceNode) {
      (this.sourceNode as AudioBufferSourceNode).playbackRate.value = rate;
    }
  } 

  get playbackRate (): number {
    if (this.sourceNode) {
      return (this.sourceNode as AudioBufferSourceNode).playbackRate.value;
    }
    return 1.0;
  }

  public getGainNode (): GainNode | undefined {
    return this.gainNode;
  }

  /**
   * 播放
   * @param source    // 音乐原始文件
   * @param playTime  // 开始播放的时间点，ms。默认是0
   * @returns 
   */
  public play (source: ArrayBuffer, playTime: number = 0): Promise<void> {
    return new Promise ((resolve, reject) => {
      if (this.playerState === PlayerState.Loading) {
        setTimeout(() => {
          this.play(source, playTime).then(() => {
            resolve();
          })
        }, 100)
      } else {
        this.playbackTime = playTime / 1000;
        this.stop();
        if (this.audioContext) {
          if (this.isArrayBuffer(source)) {
            this.playArrayBuffer(source).then(() => {
              resolve();
            }).catch((err) => {
              reject(err);
            })
          } else {
            reject({
              code: ErrorCode.ERROR_NOT_ARRAYBUFFER,
              message: "source not ArrayBuffer"
            })
          }
        } else {
          reject({
            code: ErrorCode.ERROR_NOTSUPPORT_AUDIOCONTEXT,
            message: "not support AudioContext"
          });
        }
      }
    })
  }

  public pause (): void {
    if (this.audioContext && PlayerState.Playing === this.playerState) {
      this.audioContext?.suspend();
      this.playerState = PlayerState.Pause;
    }
  }


  /**
   * 停止播放
   */
  public stop (): void {
    if (this.sourceNode) {
      (this.sourceNode as AudioBufferSourceNode).onended = null;
      (this.sourceNode as AudioBufferSourceNode).stop();
      this.sourceNode = undefined;
    }
    super.stop();
  }

  private isArrayBuffer (source: any): boolean {
    return source instanceof ArrayBuffer;
  }

  private playArrayBuffer (source: ArrayBuffer): Promise<void> {
    this.playerState = PlayerState.Loading;
    return new Promise((resolve, reject) => {
      if (this.audioContext) {
        this.audioContext.decodeAudioData(source, (buffer: AudioBuffer) => {
          this.initPlay(buffer);
          resolve();
        }, (err) => {
          this.playerState = PlayerState.End;
          reject(err);
        })
      } else {
        this.playerState = PlayerState.End;
        reject({
          code: ErrorCode.ERROR_NOTSUPPORT_AUDIOCONTEXT,
          message: "not support AudioContext"
        });
      }
    })
  }

  private initPlay (buffer: AudioBuffer): void {
    if (this.audioContext) {
      this.sourceNode = this.audioContext.createBufferSource();
      
      (this.sourceNode as AudioBufferSourceNode).onended = () => {
        this.emit("ended");
      }
      this.arrayBuffer = buffer;
      (this.sourceNode as AudioBufferSourceNode).buffer = this.arrayBuffer;
      if (this.playbackTime < 0) {
        this.playerState = PlayerState.End;
        this.emit("error", {
          code: ErrorCode.ERROR_PLAYTIME_ERROR,
          reason: "playTime out of range"
        })
      } else if (this.playbackTime * 1000 > this.duration) {
        this.playerState = PlayerState.End;
        this.emit("ended");
      } else {
        this.playNode();
      }
      
    }
  }


  protected playNode (): void {
    super.playNode();
    if (this.sourceNode) {
      let node: AudioBufferSourceNode = (this.sourceNode as AudioBufferSourceNode); 
      
      node.start(0, this.playbackTime);
      this.playerState = PlayerState.Playing;
      if (node.context) {
        this.offsetTime = node.context.currentTime;
      }
    }
  }
}