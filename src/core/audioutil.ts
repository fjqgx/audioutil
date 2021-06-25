
export class AudioUtil {

  static audioContext?: AudioContext;

  static getAudioContext (): AudioContext | undefined {
    if (!AudioUtil.audioContext) {
      // @ts-ignore
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        AudioUtil.audioContext = new AudioContext();
      }
    }

    return AudioUtil.audioContext;
  }
}