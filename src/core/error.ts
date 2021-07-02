
export enum ErrorCode {
  ERROR_NOTSUPPORT_AUDIOCONTEXT = 1000,     // 当前浏览器不支持AudioContext
  ERROR_AUTOPLAY_FAIL = 1001,               // 自动播放失败

  ERROR_NOT_ARRAYBUFFER = 1101,             // 播放内容不是ArrayBuffer
  ERROR_PLAYTIME_ERROR = 1102,              // 播放开始的时间异常，负数或者超出音频长度
}

export interface PlayerError {
  code: ErrorCode;
  reason: string;
}