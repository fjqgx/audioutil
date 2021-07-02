
import { AudioUtil } from "../audioutil";
import { BasePlayer } from "./baseplayer";


/**
 * MediaStramTrack 音频播放
 */
export class AudioMediaStreamPlayer extends BasePlayer {

  constructor() {
    super();
    this.audioVolume = 1;
    this.audioMuted = false;
  }

  public initMediaStream (source: MediaStream): boolean {
    
    if (this.audioContext) {
      if (this.isMediaStream(source)) {
        this.sourceNode = this.audioContext.createMediaStreamSource(source);
        if (this.sourceNode) {  
          return true;
        }
        
      } 
    }
    return false;
  }

  /**
   * 播放
   * @returns 
   */
  public play (source: MediaStream): boolean {
    let result = this.initMediaStream(source);
    if (result) {
      this.playNode();
      return true;
    }
    return false;
  }

  /**
   * 停止播放
   */
  public stop (): void {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = undefined;
    }
    super.stop();
  }

  /**
   * 检查source是否是MediaStream并且包含audiotrack
   * @param source 
   * @returns 
   */
  private isMediaStream (source: any): boolean {
    return source instanceof MediaStream; 
  }
}