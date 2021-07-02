import { EventEmitter } from "../../util/event";
import { ErrorCode } from "../error";
import { AudioUtil } from "../audioutil";

interface IAudioBufferPlayListener {
  autoPlayFail: (err: any) => void;
  ended: () => void;
  audioLevel: (level: number) => void;
  error: (err: {code: ErrorCode}) => void;
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
  protected timeDomainData?: Uint8Array;
  protected audioLevelTimerId: number = 0;

  constructor() {
    super();

    this.audioVolume = 1;
    this.audioMuted = false;

    this.audioContext = AudioUtil.getAudioContext();
    if (this.audioContext) {
      this.gainNode = this.audioContext.createGain();
      this.analyser = this.audioContext.createAnalyser();
      this.timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
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

  get state(): PlayerState {
    return this.playerState;
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

  /**
   * 停止播放
   */
   public stop (): void {
    
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.analyser) {
      this.analyser.disconnect();
    }
    this.playerState = PlayerState.Stop;
  }
  
  /**
   * 开始统计audiolevel
   * @param duration 
   * @returns 
   */
  public startAudioLevel (duration: number = 500): boolean {
      this.audioLevelTimerId = window.setInterval(() => {
      let max: number = 0;
      if (this.analyser && this.timeDomainData) {
        this.analyser.getByteTimeDomainData(this.timeDomainData);
        for (let i: number = 0; i < this.timeDomainData.length; ++i) {
          max = Math.max(max, Math.abs(this.timeDomainData[i] - 128));
        }
      }
      this.emit("audioLevel", max);
      }, duration);
    return false;
  }

  /**
   * 停止统计audiolevel
   */
  public stopAudioLevel (): void {
    if (this.audioLevelTimerId) {
      clearInterval(this.audioLevelTimerId);
      this.audioLevelTimerId = 0;
    }
  }

  protected playNode (): void {
    if (this.audioContext && this.sourceNode && this.gainNode && this.analyser) {

      this.sourceNode.connect(this.analyser);
      
      this.gainNode.gain.value = this.audioVolume;
      this.analyser.connect(this.gainNode);

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
      } else {
        this.playerState = PlayerState.Playing
      }
    }, 100)
  }

}