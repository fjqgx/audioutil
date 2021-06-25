import { EventEmitter } from "../../util/event";
import { ErrorCode } from "../error";
import { AudioUtil } from "../audioutil";

interface IAudioBufferPlayListener {
  autoPlayFail: (err: any) => void;
  ended: () => void;
  audioLevel: (level: number) => void;
}

export enum PlayerState {
  Init = 0,     // 初始化
  Loading,      // 加载中
  Playing,      // 播放中
  Pause,        // 暂停
  Stop,         // 停止
  End,          // 播放完成123
}


export class BasePlayer extends EventEmitter<IAudioBufferPlayListener> {

  protected audioContext?: AudioContext;
  protected sourceNode?: AudioNode;
  protected gainNode?: GainNode;
  protected analyser?: AnalyserNode;
  protected audioVolume: number;
  protected audioMuted: boolean;
  protected playerState: PlayerState = PlayerState.Init;

  constructor() {
    super();

    this.audioVolume = 1;
    this.audioMuted = false;

    this.audioContext = AudioUtil.getAudioContext();
    if (this.audioContext) {
      this.gainNode = this.audioContext.createGain();
    }
    
  }

  set volume (value: number) {
    this.audioVolume = value;
    if (this.gainNode) {
      this.gainNode.gain.value = this.audioVolume;
    }
  }

  get volume (): number {
    return this.audioVolume;
  }

  set mute (value: boolean) {
    this.audioMuted = value;
    if (this.audioMuted) {
      if (this.gainNode && this.audioContext) {
        this.gainNode.disconnect(this.audioContext.destination);
      }
    } else {
      if (this.gainNode && this.audioContext) {
        this.gainNode.connect(this.audioContext.destination);
      }
    }
  }

  /**
   * 用于自动播放失败后的恢复播放
   */
  public resume (): boolean {
    if (PlayerState.Pause === this.playerState) {
      this.audioContext?.resume();
      this.checkPlaying();
      return true;
    }
    
    return false;
  }

  protected playNode (): void {
    if (this.audioContext && this.sourceNode && this.gainNode) {

      this.analyser = this.audioContext.createAnalyser();
      this.sourceNode.connect(this.analyser);
      
      this.gainNode.gain.value = this.audioVolume;
      this.analyser.connect(this.gainNode);

      if (!this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
      }
      

      if (!this.gainNode) {
        this.gainNode = this.audioContext.createGain();
      }

      

      if (!this.audioMuted) {
        this.gainNode.connect(this.audioContext.destination);
      }
    }
    
    this.checkPlaying();
  }

  protected checkPlaying (): void {
    setTimeout(() => {
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.playerState = PlayerState.Pause;
        this.emit("autoPlayFail", {
          code: ErrorCode.ERROR_AUTOPLAY_FAIL,
          reason: "autoplay fail"
        });
      }
      console.log(this.audioContext?.state);
    }, 100)
  }

}