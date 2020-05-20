!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash-es/map"),require("lodash-es/includes"),require("lodash-es/reduce"),require("lodash-es/isString"),require("lodash-es/forEach"),require("lodash-es/isEmpty"),require("lodash-es/compact"),require("lodash-es/toPairs"),require("lodash-es/fromPairs"),require("lodash-es/uniq"),require("lodash-es/keys"),require("lodash-es/values"),require("lodash-es/some"),require("lodash-es/mapValues"),require("lodash-es/cloneDeep")):"function"==typeof define&&define.amd?define(["lodash-es/map","lodash-es/includes","lodash-es/reduce","lodash-es/isString","lodash-es/forEach","lodash-es/isEmpty","lodash-es/compact","lodash-es/toPairs","lodash-es/fromPairs","lodash-es/uniq","lodash-es/keys","lodash-es/values","lodash-es/some","lodash-es/mapValues","lodash-es/cloneDeep"],t):"object"==typeof exports?exports.Thinker=t(require("lodash-es/map"),require("lodash-es/includes"),require("lodash-es/reduce"),require("lodash-es/isString"),require("lodash-es/forEach"),require("lodash-es/isEmpty"),require("lodash-es/compact"),require("lodash-es/toPairs"),require("lodash-es/fromPairs"),require("lodash-es/uniq"),require("lodash-es/keys"),require("lodash-es/values"),require("lodash-es/some"),require("lodash-es/mapValues"),require("lodash-es/cloneDeep")):e.Thinker=t(e._.map,e._.includes,e._.reduce,e._.isString,e._.forEach,e._.isEmpty,e._.compact,e._.toPairs,e._.fromPairs,e._.uniq,e._.keys,e._.values,e._.some,e._.mapValues,e._.cloneDeep)}(window,function(e,t,n,r,i,o,a,s,u,c,l,f,p,h,d){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=20)}([function(e,t,n){"use strict";var r=n(1),i=n.n(r),o=n(9),a=n.n(o),s=n(10),u=n.n(s),c=n(4),l=n.n(c),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var p={isPromise:function(e){return e&&"function"==typeof e.then},denodify:function(e,t){return function(){for(var n=arguments.length,r=Array(n),i=0;i<n;i++)r[i]=arguments[i];return new Promise(function(n,i){e[t].apply(e,r.concat(function(e,t){e?i(e):n(t)}))})}},props:function(e){var t=a()(e);return Promise.all(i()(t,function(e){return e[1]})).then(function(e){var n=e.reduce(function(e,n,r){return e[r]=[t[r][0],n],e},[]);return u()(n)})},pending:function(){var e={};return e.promise=new Promise(function(t,n){e.resolve=t,e.reject=n}),e},try:function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return 1===n.length&&Array.isArray(n[0])&&(n=n[0]),new Promise(function(t,r){var i=e.apply(void 0,function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(n));p.isPromise(i)||(i=Promise.resolve(i)),i.then(t,r)})},delayRetry:function(){var e={maxRetryCount:5};return function(t,n,r){var i=p.pending();if(r&&r.canceled)i.reject(r.lastTimeFailedReason);else{t="function"==typeof t?t:function(){},r=r||{retriedTimes:0,lastOutSecond:.1,canceled:!1,lastTimeFailedReason:null};var o=f({},e,n);p.try(t,r.retriedTimes+1).catch(function(e){return r.lastTimeFailedReason=e,r.retriedTimes>=o.maxRetryCount||r.canceled?Promise.reject(e):(r.retriedTimes+=1,r.lastOutSecond=r.lastOutSecond*(r.retriedTimes%2?10:3),new Promise(function(e,n){setTimeout(function(){p.delayRetry(t,o,r).promise.then(e,n)},1e3*r.lastOutSecond)}))}).then(i.resolve,i.reject)}return{promise:i.promise,isCanceled:function(){return r.canceled},triedTimes:function(){return r.retriedTimes},cancel:function(){null==r.lastTimeFailedReason?i.reject():i.reject(r.lastTimeFailedReason),r.canceled=!0}}}}(),parseValidDate:function(e){if(!e)return null;var t=void 0;return t="[object Date]"===Object.prototype.toString.call(e)?e:l()(e)&&/^\d+$/.test(e)?new Date(parseInt(e,10)):new Date(e),isNaN(t.getTime())?null:t}};t.a=p},function(t,n){t.exports=e},function(e,n){e.exports=t},function(e,t){e.exports=n},function(e,t){e.exports=r},function(e,t){e.exports=i},function(e,t){e.exports=o},function(e,t){e.exports=a},function(e,t,n){var r;
/*!
 * EventEmitter v5.1.0 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */!function(t){"use strict";function i(){}var o=i.prototype,a=t.EventEmitter;function s(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function u(e){return function(){return this[e].apply(this,arguments)}}o.getListeners=function(e){var t,n,r=this._getEvents();if(e instanceof RegExp)for(n in t={},r)r.hasOwnProperty(n)&&e.test(n)&&(t[n]=r[n]);else t=r[e]||(r[e]=[]);return t},o.flattenListeners=function(e){var t,n=[];for(t=0;t<e.length;t+=1)n.push(e[t].listener);return n},o.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&((t={})[e]=n),t||n},o.addListener=function(e,t){if(!function e(t){return"function"==typeof t||t instanceof RegExp||!(!t||"object"!=typeof t)&&e(t.listener)}(t))throw new TypeError("listener must be a function");var n,r=this.getListenersAsObject(e),i="object"==typeof t;for(n in r)r.hasOwnProperty(n)&&-1===s(r[n],t)&&r[n].push(i?t:{listener:t,once:!1});return this},o.on=u("addListener"),o.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},o.once=u("addOnceListener"),o.defineEvent=function(e){return this.getListeners(e),this},o.defineEvents=function(e){for(var t=0;t<e.length;t+=1)this.defineEvent(e[t]);return this},o.removeListener=function(e,t){var n,r,i=this.getListenersAsObject(e);for(r in i)i.hasOwnProperty(r)&&-1!==(n=s(i[r],t))&&i[r].splice(n,1);return this},o.off=u("removeListener"),o.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},o.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},o.manipulateListeners=function(e,t,n){var r,i,o=e?this.removeListener:this.addListener,a=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(r=n.length;r--;)o.call(this,t,n[r]);else for(r in t)t.hasOwnProperty(r)&&(i=t[r])&&("function"==typeof i?o.call(this,r,i):a.call(this,r,i));return this},o.removeEvent=function(e){var t,n=typeof e,r=this._getEvents();if("string"===n)delete r[e];else if(e instanceof RegExp)for(t in r)r.hasOwnProperty(t)&&e.test(t)&&delete r[t];else delete this._events;return this},o.removeAllListeners=u("removeEvent"),o.emitEvent=function(e,t){var n,r,i,o,a=this.getListenersAsObject(e);for(o in a)if(a.hasOwnProperty(o))for(n=a[o].slice(0),i=0;i<n.length;i++)!0===(r=n[i]).once&&this.removeListener(e,r.listener),r.listener.apply(this,t||[])===this._getOnceReturnValue()&&this.removeListener(e,r.listener);return this},o.trigger=u("emitEvent"),o.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},o.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},o._getOnceReturnValue=function(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},o._getEvents=function(){return this._events||(this._events={})},i.noConflict=function(){return t.EventEmitter=a,i},void 0===(r=function(){return i}.call(t,n,t,e))||(e.exports=r)}(this||{})},function(e,t){e.exports=s},function(e,t){e.exports=u},function(e,t,n){"use strict";(function(e){var r=n(12),i=n(13),o=n(0),a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var s=void 0;try{s=window||e||{}}catch(e){s={}}var u={canStartSyncNow:function(e,t){t(null,!0)},sendRequest:function(e,t,n){n(null,{config:t,status:200,headers:{},data:{}})},getDataToSync:function(e,t){t(null)},getAllDataToSync:function(e,t){t(null)},getItems:function(e,t,n){n(null,[])},updateLocalData:function(e,t,n){n(null)},deserializeItem:function(e,t,n,r,i,o,a){var s=void 0;switch(n){case"change":case"new":s=o;break;default:s=i||r}a(null,s)},call:function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return o.a.denodify(this,e).apply(void 0,function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(n))}};t.a=a({apiPrefix:"https://api-ng.pomotodo.com",debounce:5e3,blockRetryInterval:5e3,logger:new r.a,storage:s.localStorage||new i.a,autoBackgroundCompletelySync:!0,autoRetryRequestCount:5},u)}).call(this,n(21))},function(e,t,n){"use strict";var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var o=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.option=r({},this.constructor.defaultOption,t),this.logs=[],this.errors=[]}return i(e,[{key:"log",value:function(){for(var e,t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];this.option.print&&(e=console).log.apply(e,n),this.logs.push(n)}},{key:"error",value:function(){for(var e,t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];this.option.print&&(e=console).error.apply(e,n),this.errors.push(n)}}]),e}();o.defaultOption={print:!0},t.a=o},function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.store={}}return r(e,[{key:"key",value:function(e){return Object.keys(this.store)[e]}},{key:"getItem",value:function(e){return this.store[e]}},{key:"setItem",value:function(e,t){this.store[e]=t}},{key:"removeItem",value:function(e){delete this.store[e]}},{key:"clear",value:function(){this.store={}}},{key:"length",get:function(){return Object.keys(this.store).length}}]),e}();t.a=i},function(e,t){e.exports=c},function(e,t){e.exports=l},function(e,t){e.exports=f},function(e,t){e.exports=p},function(e,t){e.exports=h},function(e,t){e.exports=d},function(e,t,n){e.exports=n(22)},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";n.r(t);var r={};n.r(r),n.d(r,"SyncFailedError",function(){return f}),n.d(r,"ResponseEntityEmptyError",function(){return p}),n.d(r,"TimeoutError",function(){return h});var i=n(8),o=n.n(i),a=n(0),s=n(11);function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var f=function(e){function t(e){u(this,t);var n=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.response=e,"function"==typeof Error.captureStackTrace&&Error.captureStackTrace(n,n.constructor),n.name="SyncFailedError",n.message="Sync failed",n}return l(t,Error),t}(),p=function(e){function t(e){u(this,t);var n=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.response=e,"function"==typeof Error.captureStackTrace&&Error.captureStackTrace(n,n.constructor),n.name="ResponseEntityEmptyError",n.message="Response entity is empty",n}return l(t,Error),t}(),h=function(e){function t(){u(this,t);var e=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return"function"==typeof Error.captureStackTrace&&Error.captureStackTrace(e,e.constructor),e.name="TimeoutError",e.message="timeout",e}return l(t,Error),t}(),d=n(14),y=n.n(d),m=n(15),g=n.n(m),v=n(16),_=n.n(v),b=n(2),S=n.n(b),O=n(5),T=n.n(O),w=n(1),k=n.n(w),j=n(6),E=n.n(j),P=n(17),R=n.n(P),x=n(3),q=n.n(x),I=n(18),D=n.n(I),A=n(4),C=n.n(A),L=n(19),V=n.n(L),z=n(7),N=n.n(z),F=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),M=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var B=function(e,t,n){return e[n]="todo_order"===n?[]:y()((e[n]||[]).concat(g()(t))),e},J=function(e){if(!Array.isArray(e))return e;var t=N()(k()(e,"timeout")),n=t.length?Math.min.apply(Math,t):void 0,r=N()(k()(e,"syncAllData")),i=R()(r);return M({},Object.assign.apply(Object,[{}].concat(e)),{timeout:n,syncAllData:i})},U=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return n.initOption=M({},t.defaultOption,e),n.initOption.apiPrefix=n.initOption.apiPrefix.replace(/\/$/,""),n._nextSync=[],n._currentSync=[],n._syncCallbacks=[],n._doDebounceTimer=null,n._autoSwitchStatusTimer=null,n._doSyncRetryInfo=null,n.backgroundInitializeCompletelySyncSucceed&&n.trigger("backgroundInitializeCompletelySyncSucceed"),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.a),F(t,[{key:"cleanStoragedStatus",value:function(e){var t={lastSuccessTime:"ds_localdb_last_sync",lastFailTime:"app_last_sync_failed_time",backgroundInitializeCompletelySyncSucceed:"ds_localdb_init_completely_synced"};null==e?_()(t).forEach(this.initOption.storage.removeItem.bind(this.initOption.storage)):null!=t[e]&&this.initOption.storage.removeItem(t[e])}},{key:"do",value:function(e,t,n){var r=this;if(!e)throw new Error("[Thinker] reason is required");var i=this.initOption.debounce;t&&null!=t.debounce&&(i=t.debounce);var o=[void 0,"waiting","succeed","failed"];S()(o.concat(["preparing","blocking"]),this.status)?(S()(o,this.status)?(this._changeStatus("preparing"),clearTimeout(this._autoSwitchStatusTimer),this._autoSwitchStatusTimer=null):clearTimeout(this._doDebounceTimer),this._syncCallbacks.push(n),this._currentSync.push({reason:e,passInOption:t}),this._doDebounceTimer=setTimeout(function(){clearTimeout(r._doDebounceTimer),r._doDebounceTimer=null,r._intoSync()},i)):(this._syncCallbacks.push(n),this._nextSync.push({reason:e,passInOption:t})),this._doSyncRetryInfo&&this._doSyncRetryInfo.triedTimes()>1&&!this._doSyncRetryInfo.isCanceled()&&this._doSyncRetryInfo.cancel()}},{key:"_intoSync",value:function(){var e=this;this._callSync().then(function(){var t=e._syncCallbacks;e._syncCallbacks=[],e._changeStatus("succeed"),e.initOption.logger.log("[Thinker] succeed"),t.forEach(function(e){return"function"==typeof e&&e()});var n=setTimeout(function(){e._autoSwitchStatusTimer===n&&(e._autoSwitchStatusTimer=null,e._changeStatus("waiting"))},2e3);e._autoSwitchStatusTimer=n},function(t){var n=e._syncCallbacks;e._syncCallbacks=[],e._changeStatus("failed",[t]),e.initOption.logger.log("[Thinker] failed"),n.forEach(function(e){return"function"==typeof e&&e(t)});var r=setTimeout(function(){e._autoSwitchStatusTimer===r&&(e._autoSwitchStatusTimer=null)},2e3);return e._autoSwitchStatusTimer=r,Promise.reject(t)})}},{key:"_callSync",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=k()(this._currentSync,"reason"),r=k()(this._currentSync,"passInOption"),i={passInOptions:r,isFirstTime:null==this.lastSuccessTime},o=J(r),a=function(n){return function(r){return e._tryToStartSecondSync(n,t,r)}};return this._changeStatus("blocking"),this._waitUntilCanSync(i,this.initOption).then(function(){return e._changeStatus("processing"),e.initOption.logger.log("[Thinker] start("+t+"), reasons: \n  - "+n.join("\n  - ")),e._doSync(i,o)}).then(a(!1),a(!0))}},{key:"_tryToStartSecondSync",value:function(e,t,n){return E()(this._nextSync)?(this._currentSync=[],e?Promise.reject(n):n):(this._currentSync=this._nextSync,this._nextSync=[],this._callSync(t+1))}},{key:"_waitUntilCanSync",value:function(e,t){var n=a.a.pending();return function r(){t.call("canStartSyncNow",e).then(function(e){if(!0===e)n.resolve();else{var i=C()(e)?e:"some reason";t.logger.log("[Thinker] sync blocked by "+i+", will try again after "+t.blockRetryInterval/1e3+" seconds"),setTimeout(r,t.blockRetryInterval)}}).catch(n.reject)}(),n.promise}},{key:"_changeStatus",value:function(e,t){this.status=e,this.trigger(e,t),this.trigger("statusChange",[e].concat(t))}},{key:"_doSync",value:function(e,t){var n=this,r=a.a.pending(),i=t.syncAllData?"getAllDataToSync":"getDataToSync",o=void 0,s=!1;return null!=t.timeout?o=t.timeout:t.syncAllData||null==this.initOption.timeout?t.syncAllData&&null!=this.initOption.syncAllDataTimeout&&(o=this.initOption.syncAllDataTimeout):o=this.initOption.timeout,null!=o&&setTimeout(function(){s=!0,r.reject(new h)},o),this.initOption.call(i,e).then(function(r){if(!s)return n._sendSyncRequest(e,t,r)}).then(function(t){if(!s)return n._updateLocalData(e,t)}).then(function(e){if(!s){var t=a.a.parseValidDate(e.data.last_sync)||new Date;return n.initOption.storage.setItem("ds_localdb_last_sync",t.getTime()),n.initOption.storage.removeItem("app_last_sync_failed_time"),e}},function(e){if(!s)return n.initOption.storage.setItem("app_last_sync_failed_time",(new Date).getTime()),Promise.reject(e)}).then(function(r){s||n._tryToTriggerBackgroundInitializeCompletelySync(e,t)}).then(function(e){s||r.resolve(e)},function(e){s||r.reject(e)}),r.promise}},{key:"_tryToTriggerBackgroundInitializeCompletelySync",value:function(e,t){var n=this;if(!this.backgroundSyncing&&!this.backgroundInitializeCompletelySyncSucceed&&!e.background&&this.initOption.autoBackgroundCompletelySync){var r={syncAllData:!0},i={passInOptions:e.passInOptions.concat(r),isFirstTime:!1,background:!0};this.backgroundSyncing=!0,this._doSync(i,r).then(function(){n.backgroundSyncing=!1,n.initOption.storage.setItem("ds_localdb_init_completely_synced","true"),n.trigger("backgroundInitializeCompletelySyncSucceed")},function(e){n.backgroundSyncing=!1})}}},{key:"_sendSyncRequest",value:function(e,t,n){var r=this,i=void 0,o={url:this.initOption.apiPrefix+"/account/sync",method:"POST",data:t.syncAllData?{objects:n}:this.lastSuccessTime?{last_sync:this.lastSuccessTime.toJSON(),objects:n}:{fast_from:new Date(Date.now()-26784e5).toJSON(),objects:{}},params:null},s=function(t){return r.initOption.logger.log("[Thinker] request retry("+t+")",o),r.initOption.call("sendRequest",e,V()(o)).then(function(e){return e.config=o,e},function(e){return r.initOption.logger.error("[Thinker] request failed("+t+")",e),Promise.reject(e)})};return this.initOption.autoRetryRequestCount?(this._doSyncRetryInfo=a.a.delayRetry(s,{maxRetryCount:this.initOption.autoRetryRequestCount}),i=this._doSyncRetryInfo.promise):i=s(1),i.then(function(e){if((e.status>=300||e.status<200)&&507!==e.status)throw new f(e);if(!e.data)throw new p(e);return e})}},{key:"_updateLocalData",value:function(e,t){var n=this,r=t.config.data.objects,i=t.data.objects,o={};return q()(r,B,o),q()(i,B,o),this.initOption.call("getItems",e,o).then(function(s){return a.a.props(D()(o,function(o,a){var u=r[a],c=s[a],l=i[a];return n._deserializeItem(e,a,o,u,c,l,t)}))}).then(function(t){return T()(t,function(e,n){E()(e)?delete t[n]:T()(e,function(t,n){E()(t)&&delete e[n]})}),n.initOption.call("updateLocalData",e,t)}).then(function(){return t})}},{key:"_decideAction",value:function(e,t,n,r){var i=e&&e.updated_at?new Date(e.updated_at).valueOf():void 0,o=t&&t.updated_at?new Date(t.updated_at).valueOf():void 0,a=n&&n.updated_at?new Date(n.updated_at).valueOf():void 0;return t?n?o>a?"doNothing":o===a&&r?"doNothing":"update":r?"doNothing":e?o>i?"doNothing":o===i?"cleanDirty":"doNothing":"doNothing":n?"new":"doNothing"}},{key:"_deserializeItem",value:function(e,t,n,r,i,o,s){var u=this;if("todo_order"!==t&&S()(s.data.failures,t)){var c=void 0;return null!=r&&(c=q()(r,function(e,t,n){return e[n]=i[n]||t,e},{})),Promise.resolve({keepDirty:c||{}})}if("todo_order"===t){var l=S()(s.data.failures,"todo_order"),f=this._decideAction(r,i,o,l);return this.initOption.call("deserializeItem",e,t,f,r,i,o).then(function(e){return function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},f,e)})}var p=q()(n,function(n,a){var c=null!=r?r[a]:void 0,l=null!=i?i[a]:void 0,f=null!=o?o[a]:void 0,p=S()(s.data.failures,t+":"+a),h=u._decideAction(c,l,f,p);return n[h]||(n[h]={}),n[h][a]=u.initOption.call("deserializeItem",e,t,h,c,l,f),n},{});return a.a.props(q()(p,function(e,t,n){return e[n]=a.a.props(t),e},{}))}}]),t}();U.defaultOption=s.a,U.mergeSyncOptions=J,function(e){e.prototype.status="waiting",Object.defineProperties(e.prototype,{backgroundInitializeCompletelySyncSucceed:{get:function(){return"true"===this.initOption.storage.getItem("ds_localdb_init_completely_synced")}},lastSuccessTime:{get:function(){return a.a.parseValidDate(this.initOption.storage.getItem("ds_localdb_last_sync"))}},lastFailTime:{get:function(){return a.a.parseValidDate(this.initOption.storage.getItem("app_last_sync_failed_time"))}}})}(U),T()(r,function(e,t){U[t]=e});t.default=U}])});
//# sourceMappingURL=main.js.map