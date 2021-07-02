/*! audioutil - ver 1.1.1 created:2021/7/2 下午1:08:33 */
!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o=e();for(var i in o)("object"==typeof exports?exports:t)[i]=o[i]}}(self,(function(){return(()=>{"use strict";var t={515:(t,e,o)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.AudioMixer=void 0;var i=o(875),r=o(603),n=function(){function t(){this.audioContext=i.AudioUtil.getAudioContext()}return t.prototype.startMix=function(t,e){var o=this;return new Promise((function(i,n){o.audioContext?(o.mediaStreamSource=o.audioContext.createMediaStreamSource(t),o.mediaStreamDest=o.audioContext.createMediaStreamDestination(),o.musicNode=e.getGainNode(),o.musicNode?(o.mediaStreamSource.connect(o.mediaStreamDest),o.musicNode.connect(o.mediaStreamDest),i(o.mediaStreamDest.stream)):n({code:r.ErrorCode.ERROR_NOTSUPPORT_AUDIOCONTEXT,message:"not support AudioContext"})):n({code:r.ErrorCode.ERROR_NOTSUPPORT_AUDIOCONTEXT,message:"not support AudioContext"})}))},t.prototype.stopMix=function(){this.audioContext&&this.musicNode&&this.musicNode.disconnect()},t}();e.AudioMixer=n},875:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.AudioUtil=void 0;var o=function(){function t(){}return t.getAudioContext=function(){if(!t.audioContext){var e=window.AudioContext||window.webkitAudioContext;e&&(t.audioContext=new e)}return t.audioContext},t}();e.AudioUtil=o},603:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ErrorCode=void 0,function(t){t[t.ERROR_NOTSUPPORT_AUDIOCONTEXT=1e3]="ERROR_NOTSUPPORT_AUDIOCONTEXT",t[t.ERROR_AUTOPLAY_FAIL=1001]="ERROR_AUTOPLAY_FAIL",t[t.ERROR_NOT_ARRAYBUFFER=1101]="ERROR_NOT_ARRAYBUFFER",t[t.ERROR_PLAYTIME_ERROR=1102]="ERROR_PLAYTIME_ERROR"}(e.ErrorCode||(e.ErrorCode={}))},554:function(t,e,o){var i,r=this&&this.__extends||(i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)});Object.defineProperty(e,"__esModule",{value:!0}),e.AudioBufferPlayer=void 0;var n=o(603),a=o(314),u=function(t){function e(){var e=t.call(this)||this;return e.playbackTime=0,e.offsetTime=0,e}return r(e,t),Object.defineProperty(e.prototype,"isPlaying",{get:function(){return this.playerState===a.PlayerState.Playing||this.playerState===a.PlayerState.Loading},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"duration",{get:function(){var t=this.sourceNode;return t&&t.buffer?Math.round(1e3*t.buffer.duration):-1},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"currentTime",{get:function(){var t=this.sourceNode;if(t&&t.context&&(a.PlayerState.Playing===this.playerState||a.PlayerState.Pause===this.playerState)){var e=Math.round(1e3*(t.context.currentTime-this.offsetTime+this.playbackTime));return e>this.duration?this.duration:e}return-1},set:function(t){this.sourceNode&&this.arrayBuffer&&(this.playbackTime=t/1e3,t<0||t>=this.duration?(this.stop(),this.playerState=a.PlayerState.End,this.emit("error",{code:n.ErrorCode.ERROR_PLAYTIME_ERROR,reason:"currentTime out of range"})):(this.stop(),this.initPlay(this.arrayBuffer)))},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"playbackRate",{get:function(){return this.sourceNode?this.sourceNode.playbackRate.value:1},set:function(t){this.sourceNode&&(this.sourceNode.playbackRate.value=t)},enumerable:!1,configurable:!0}),e.prototype.getGainNode=function(){return this.gainNode},e.prototype.play=function(t,e){var o=this;return void 0===e&&(e=0),new Promise((function(i,r){o.playerState===a.PlayerState.Loading?setTimeout((function(){o.play(t,e).then((function(){i()}))}),100):(o.playbackTime=e/1e3,o.stop(),o.audioContext?o.isArrayBuffer(t)?o.playArrayBuffer(t).then((function(){i()})).catch((function(t){r(t)})):r({code:n.ErrorCode.ERROR_NOT_ARRAYBUFFER,message:"source not ArrayBuffer"}):r({code:n.ErrorCode.ERROR_NOTSUPPORT_AUDIOCONTEXT,message:"not support AudioContext"}))}))},e.prototype.pause=function(){var t;this.audioContext&&a.PlayerState.Playing===this.playerState&&(null===(t=this.audioContext)||void 0===t||t.suspend(),this.playerState=a.PlayerState.Pause)},e.prototype.stop=function(){this.sourceNode&&(this.sourceNode.onended=null,this.sourceNode.stop(),this.sourceNode=void 0),t.prototype.stop.call(this)},e.prototype.isArrayBuffer=function(t){return t instanceof ArrayBuffer},e.prototype.playArrayBuffer=function(t){var e=this;return this.playerState=a.PlayerState.Loading,new Promise((function(o,i){e.audioContext?e.audioContext.decodeAudioData(t,(function(t){e.initPlay(t),o()}),(function(t){e.playerState=a.PlayerState.End,i(t)})):(e.playerState=a.PlayerState.End,i({code:n.ErrorCode.ERROR_NOTSUPPORT_AUDIOCONTEXT,message:"not support AudioContext"}))}))},e.prototype.initPlay=function(t){var e=this;this.audioContext&&(this.sourceNode=this.audioContext.createBufferSource(),this.sourceNode.onended=function(){e.emit("ended")},this.arrayBuffer=t,this.sourceNode.buffer=this.arrayBuffer,this.playbackTime<0||1e3*this.playbackTime>this.duration?(this.playerState=a.PlayerState.End,this.emit("error",{code:n.ErrorCode.ERROR_PLAYTIME_ERROR,reason:"playTime out of range"})):this.playNode())},e.prototype.playNode=function(){if(t.prototype.playNode.call(this),this.sourceNode){var e=this.sourceNode;e.start(0,this.playbackTime),this.playerState=a.PlayerState.Playing,e.context&&(this.offsetTime=e.context.currentTime)}},e}(a.BasePlayer);e.AudioBufferPlayer=u},159:function(t,e,o){var i,r=this&&this.__extends||(i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)});Object.defineProperty(e,"__esModule",{value:!0}),e.AudioMediaStreamPlayer=void 0;var n=function(t){function e(){var e=t.call(this)||this;return e.audioVolume=1,e.audioMuted=!1,e}return r(e,t),e.prototype.initMediaStream=function(t){return!!(this.audioContext&&this.isMediaStream(t)&&(this.sourceNode=this.audioContext.createMediaStreamSource(t),this.sourceNode))},e.prototype.play=function(t){return!!this.initMediaStream(t)&&(this.playNode(),!0)},e.prototype.stop=function(){this.sourceNode&&(this.sourceNode.disconnect(),this.sourceNode=void 0),t.prototype.stop.call(this)},e.prototype.isMediaStream=function(t){return t instanceof MediaStream},e}(o(314).BasePlayer);e.AudioMediaStreamPlayer=n},314:function(t,e,o){var i,r=this&&this.__extends||(i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)});Object.defineProperty(e,"__esModule",{value:!0}),e.BasePlayer=e.PlayerState=void 0;var n,a=o(125),u=o(603),s=o(875);!function(t){t[t.Init=0]="Init",t[t.Loading=1]="Loading",t[t.Playing=2]="Playing",t[t.Pause=3]="Pause",t[t.Stop=4]="Stop",t[t.End=5]="End"}(n=e.PlayerState||(e.PlayerState={}));var d=function(t){function e(){var e=t.call(this)||this;return e.playerState=n.Init,e.audioLevelTimerId=0,e.audioVolume=1,e.audioMuted=!1,e.audioContext=s.AudioUtil.getAudioContext(),e.audioContext&&(e.gainNode=e.audioContext.createGain(),e.analyser=e.audioContext.createAnalyser(),e.timeDomainData=new Uint8Array(e.analyser.frequencyBinCount)),e}return r(e,t),Object.defineProperty(e.prototype,"volume",{get:function(){return this.audioVolume},set:function(t){this.audioVolume=t,this.gainNode&&(this.gainNode.gain.value=this.audioVolume)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"mute",{set:function(t){this.audioMuted=t,this.audioMuted?this.gainNode&&this.audioContext&&this.gainNode.disconnect(this.audioContext.destination):this.gainNode&&this.audioContext&&this.gainNode.connect(this.audioContext.destination)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"state",{get:function(){return this.playerState},enumerable:!1,configurable:!0}),e.prototype.resume=function(){var t;return n.Pause===this.playerState&&(null===(t=this.audioContext)||void 0===t||t.resume(),this.checkPlaying(),!0)},e.prototype.stop=function(){this.gainNode&&this.gainNode.disconnect(),this.analyser&&this.analyser.disconnect(),this.playerState=n.Stop},e.prototype.startAudioLevel=function(t){var e=this;return void 0===t&&(t=500),this.audioLevelTimerId=window.setInterval((function(){var t=0;if(e.analyser&&e.timeDomainData){e.analyser.getByteTimeDomainData(e.timeDomainData);for(var o=0;o<e.timeDomainData.length;++o)t=Math.max(t,Math.abs(e.timeDomainData[o]-128))}e.emit("audioLevel",t)}),t),!1},e.prototype.stopAudioLevel=function(){this.audioLevelTimerId&&(clearInterval(this.audioLevelTimerId),this.audioLevelTimerId=0)},e.prototype.playNode=function(){this.audioContext&&this.sourceNode&&this.gainNode&&this.analyser&&(this.sourceNode.connect(this.analyser),this.gainNode.gain.value=this.audioVolume,this.analyser.connect(this.gainNode),this.audioMuted||this.gainNode.connect(this.audioContext.destination)),this.checkPlaying()},e.prototype.checkPlaying=function(){var t=this;setTimeout((function(){t.audioContext&&"suspended"===t.audioContext.state?(t.playerState=n.Pause,t.emit("autoPlayFail",{code:u.ErrorCode.ERROR_AUTOPLAY_FAIL,reason:"autoplay fail"})):t.playerState=n.Playing}),100)},e}(a.EventEmitter);e.BasePlayer=d},125:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.EventEmitter=void 0;var o=function(){function t(){this._eventMap={}}return t.prototype.listeners=function(t){return this._eventMap[t]||[]},t.prototype.emit=function(t){for(var e=this,o=[],i=1;i<arguments.length;i++)o[i-1]=arguments[i];var r=this._eventMap[t];return!!Array.isArray(r)&&(r.forEach((function(t){return t.apply(e,o)})),!0)},t.prototype.off=function(t,e){var o=this._eventMap[t];return Array.isArray(o)&&(this._eventMap[t]=o.filter((function(t){return t!==e}))),this},t.prototype.removeAllListeners=function(t){return void 0===t?this._eventMap={}:this._eventMap[t]&&(this._eventMap[t]=[]),this},t.prototype.on=function(t,e){this._eventMap[t]?this._eventMap[t].push(e):this._eventMap[t]=[e]},t.prototype.once=function(t,e){var o=this,i=function(){for(var r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];o.off(t,i),e.apply(o,r)};return this.on(t,i),this},t}();e.EventEmitter=o}},e={};function o(i){var r=e[i];if(void 0!==r)return r.exports;var n=e[i]={exports:{}};return t[i].call(n.exports,n,n.exports,o),n.exports}var i={};return(()=>{var t=i;Object.defineProperty(t,"__esModule",{value:!0}),t.AudioMixer=t.AudioMediaStreamPlayer=t.AudioBufferPlayer=t.AudioUtil=void 0;var e=o(875);Object.defineProperty(t,"AudioUtil",{enumerable:!0,get:function(){return e.AudioUtil}});var r=o(159);Object.defineProperty(t,"AudioMediaStreamPlayer",{enumerable:!0,get:function(){return r.AudioMediaStreamPlayer}});var n=o(554);Object.defineProperty(t,"AudioBufferPlayer",{enumerable:!0,get:function(){return n.AudioBufferPlayer}});var a=o(515);Object.defineProperty(t,"AudioMixer",{enumerable:!0,get:function(){return a.AudioMixer}}),window&&(window.AudioUtil=e.AudioUtil,window.AudioMediaStreamPlayer=r.AudioMediaStreamPlayer,window.AudioBufferPlayer=n.AudioBufferPlayer,window.AudioMixer=a.AudioMixer)})(),i})()}));