import {AudioUtil} from "./core/audioutil";
import {AudioMediaStreamPlayer} from "./core/player/audiomediastreamplayer";
import {AudioBufferPlayer} from "./core/player/audiobufferplayer";
import {AudioMixer} from "./core/audiomixer";

declare global {
  interface Window {
    AudioUtil: any;
    AudioMediaStreamPlayer: any;
    AudioBufferPlayer: any;
    AudioMixer: any;
  }
}

if (window) {
  window.AudioUtil = AudioUtil;
  window.AudioMediaStreamPlayer = AudioMediaStreamPlayer;
  window.AudioBufferPlayer = AudioBufferPlayer;
  window.AudioMixer = AudioMixer;
}

export { AudioUtil, AudioBufferPlayer, AudioMediaStreamPlayer, AudioMixer };