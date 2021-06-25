
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
          // let analyser = this.audioContext.createAnalyser();
          // this.sourceNode.connect(analyser);
          // let bufferLength = analyser.frequencyBinCount;
          // let dataArray = new Uint8Array(bufferLength);
    
    
          
    
          // setInterval(() => {
    
          //   analyser.getByteTimeDomainData(dataArray);
          //   let max = 0;
          //   for (let i = 0; i < bufferLength; ++i) {
          //     max = Math.max(max, Math.abs(dataArray[i] - 128));
          //   }
    
          //   console.log("max:", max, "   ", this.audioContext?.state);
          // }, 200);
    
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
    if (this.audioContext) {
      if (this.gainNode) {
        this.gainNode.disconnect(this.audioContext.destination);
        this.gainNode = undefined;
      }
      this.sourceNode = undefined;
    }
  }

  /**
   * 检查source是否是MediaStream并且包含audiotrack
   * @param source 
   * @returns 
   */
  private isMediaStream (source: any): boolean {
    return source instanceof MediaStream; 
  }

  // private isHtmlAudioElement (source: any): boolean {
  //   return source instanceof HTMLAudioElement;
  // }


  // private playMediastream (source: MediaStream): void {
  //   if (this.audioContext) {
  //     this.sourceNode = this.audioContext.createMediaStreamSource(source);
  //     this.playNode();
  //   }
  // }

  // private playHtmlMediaElement (source: HTMLMediaElement): void {
  //   if (this.audioContext) {
  //     this.sourceNode = this.audioContext.createMediaElementSource(source);
  //     this.playNode();
  //   }
  // }

  
}