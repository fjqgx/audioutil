declare function event_aotuplay_fail(err:PlayerError): void;
declare function event_ended(): void;
declare function event_audiolevel(level: number): void;
declare function event_error(err: PlayerError): void;


export interface PlayerError {
  code: ErrorCode;
  reason: string;
}


export declare enum ErrorCode {
  ERROR_NOTSUPPORT_AUDIOCONTEXT = 1000,     // 当前浏览器不支持AudioContext
  ERROR_AUTOPLAY_FAIL = 1001,               // 自动播放失败

  ERROR_NOT_ARRAYBUFFER = 1101,             // 播放内容不是ArrayBuffer
  ERROR_PLAYTIME_ERROR = 1102,              // 播放开始的时间异常，负数或者超出音频长度
}

/**
 * 播放器状态
 */
export enum PlayerState {
  Init = 0,     // 初始化
  Loading,      // 加载中
  Playing,      // 播放中
  Pause,        // 暂停
  Stop,         // 停止
  End,          // 播放完成123
}

/**
 * 音频工具类
 */
export declare class AudioUtil {

  /**
   * 获取AudioContext对象(单例)
   * 如果返回undefined表示此浏览器不支持AudioContext
   */
  static getAudioContext (): AudioContext | undefined;
}


export declare class AudioBufferPlayer {
  
  /**
   * 获取音频长度，如果返回-1表示音频没有加载完成
   */
  get duration (): number;


  /**
   * 设置播放音量
   */
  set volume (value: number);


  /**
   * 获取当前音量
   */
  get volume (): number;


  /**
   * 设置mute
   * @param value true: 静音  false: 取消静音
   */
  set mute (value: boolean);

  /**
   * 设置当前音频播放的位置
   */
  set currentTime (value: number);

  /**
   * 获取当前音频播放的位置
   */
  get currentTime (): number;

  /**
   * 获取播放器的当前状态
   */
  get state(): PlayerState;

  /**
   * 播放音频
   * @param source    音频文件内容 
   * @param playTime  开始播放的时间，单位ms，默认是0
   */
  play (source: ArrayBuffer, playTime: number): Promise<void>;


  /**
   * 停止播放
   */
  stop (): void;

  /**
   * 暂停
   */
  pause (): void;

  /**
   * 用于自动播放失败后或者暂停后的恢复播放
   */
  resume (): void;

  /**
   * 开始统计audiolevel
   * @param duration 默认值500，单位ms
   */
  startAudioLevel (duration: number): boolean;

  /**
   * 停止统计audiolevel
   */
  stopAudioLevel (): void;

  on (event: "autoPlayFail", listener: typeof event_aotuplay_fail): void;
  on (event: "ended", listener: typeof event_ended): void;
  on (event: "audioLevel", listener: typeof event_audiolevel): void;
}

export declare class AudioMediaStreamPlayer {

  /**
   * 设置播放音量
   */
  set volume (value: number);


  /**
   * 获取当前音量
   */
  get volume (): number;
 
 
  /**
   * 设置mute
   * @param value true: 静音  false: 取消静音
   */
  set mute (value: boolean);

  /**
   * 用于自动播放失败后的恢复播放
   */
  resume (): void;

  play (source: MediaStream): boolean;

  stop (): void;

  /**
   * 开始统计audiolevel
   * @param duration 统计间隔时间，默认值500，单位ms
   */
   startAudioLevel (duration: number): boolean;

   /**
    * 停止统计audiolevel
    */
   stopAudioLevel (): void;

  on (event: "autoPlayFail", listener: typeof event_aotuplay_fail): void;
  on (event: "audioLevel", listener: typeof event_audiolevel): void;
}

export declare class AudioMixer {

  /**
   * 开始混音 
   * @param mediastream 
   * @param player 
   */
  startMix (mediastream: MediaStream, player: AudioBufferPlayer): Promise<MediaStream>;

  /**
   * 停止混音
   */
  stopMix (): void 
}