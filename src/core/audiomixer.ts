import { resolve } from "path";
import { AudioUtil } from "./audioutil";
import { ErrorCode } from "./error";
import { AudioBufferPlayer } from "./player/audiobufferplayer";

export class AudioMixer {

  protected audioContext?: AudioContext;

  protected mediaStreamSource?: MediaStreamAudioSourceNode;
  protected mediaStreamDest?: MediaStreamAudioDestinationNode;

  protected musicNode?: GainNode;


  constructor() {
    this.audioContext = AudioUtil.getAudioContext();
    if (this.audioContext) {
      this.mediaStreamDest = this.audioContext.createMediaStreamDestination();
    }
  }


  public startMix (mediastream: MediaStream, player: AudioBufferPlayer): Promise<MediaStream> {
    return new Promise ((resolve, reject) => {
      if (this.audioContext && this.mediaStreamDest) {
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(mediastream);
        this.musicNode = player.getGainNode();

        if (this.musicNode) {
          this.mediaStreamSource.connect(this.mediaStreamDest);
          this.musicNode.connect(this.mediaStreamDest);

          resolve(this.mediaStreamDest.stream);
        } else {
          reject({
            code: ErrorCode.ERROR_NOTSUPPORT_AUDIOCONTEXT,
            message: "not support AudioContext"
          });
        }
      } else {
        reject({
          code: ErrorCode.ERROR_NOTSUPPORT_AUDIOCONTEXT,
          message: "not support AudioContext"
        });
      }
    })
  }

  public stopMix (): void {
    if (this.audioContext && this.musicNode) {
      this.musicNode.disconnect();
    }
  }

}