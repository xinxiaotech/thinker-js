(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash/extend"), require("lodash/map"), require("lodash/toPairs"), require("lodash/fromPairs"), require("lodash/isString"), require("lodash/keys"), require("lodash/includes"), require("lodash/forEach"), require("lodash/isEmpty"), require("lodash/some"), require("lodash/reduce"), require("lodash/filter"), require("lodash/mapValues"), require("lodash/cloneDeep"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash/extend", "lodash/map", "lodash/toPairs", "lodash/fromPairs", "lodash/isString", "lodash/keys", "lodash/includes", "lodash/forEach", "lodash/isEmpty", "lodash/some", "lodash/reduce", "lodash/filter", "lodash/mapValues", "lodash/cloneDeep"], factory);
	else if(typeof exports === 'object')
		exports["Thinker"] = factory(require("lodash/extend"), require("lodash/map"), require("lodash/toPairs"), require("lodash/fromPairs"), require("lodash/isString"), require("lodash/keys"), require("lodash/includes"), require("lodash/forEach"), require("lodash/isEmpty"), require("lodash/some"), require("lodash/reduce"), require("lodash/filter"), require("lodash/mapValues"), require("lodash/cloneDeep"));
	else
		root["Thinker"] = factory(root["_"]["extend"], root["_"]["map"], root["_"]["toPairs"], root["_"]["fromPairs"], root["_"]["isString"], root["_"]["keys"], root["_"]["includes"], root["_"]["forEach"], root["_"]["isEmpty"], root["_"]["some"], root["_"]["reduce"], root["_"]["filter"], root["_"]["mapValues"], root["_"]["cloneDeep"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_15__, __WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_17__, __WEBPACK_EXTERNAL_MODULE_18__, __WEBPACK_EXTERNAL_MODULE_19__, __WEBPACK_EXTERNAL_MODULE_20__, __WEBPACK_EXTERNAL_MODULE_21__, __WEBPACK_EXTERNAL_MODULE_22__, __WEBPACK_EXTERNAL_MODULE_23__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var EventEmitter = __webpack_require__(2);
	var utils = __webpack_require__(3);
	var definePrototype = __webpack_require__(9);
	var defaultOption = __webpack_require__(11);
	var errors = __webpack_require__(14);
	var CONSTS = __webpack_require__(10);
	
	var _keys = __webpack_require__(15);
	var _extend = __webpack_require__(4);
	var _includes = __webpack_require__(16);
	var _forEach = __webpack_require__(17);
	var _map = __webpack_require__(5);
	var _isEmpty = __webpack_require__(18);
	var _some = __webpack_require__(19);
	var _reduce = __webpack_require__(20);
	var _filter = __webpack_require__(21);
	var _mapValues = __webpack_require__(22);
	var _isString = __webpack_require__(8);
	var _cloneDeep = __webpack_require__(23);
	
	var pickObjectsIds = function pickObjectsIds(memo, items, type) {
	  if (type === 'todo_order') {
	    memo[type] = [];
	  } else {
	    memo[type] = (memo[type] || []).concat(_keys(items));
	  }
	  return memo;
	};
	
	var Thinker = function (_EventEmitter) {
	  _inherits(Thinker, _EventEmitter);
	
	  /**
	   * @constructs Thinker
	   * @param {Object} passInOption
	   * @see {@link Thinker.defaultOption}
	   */
	  function Thinker(passInOption) {
	    _classCallCheck(this, Thinker);
	
	    var _this = _possibleConstructorReturn(this, (Thinker.__proto__ || Object.getPrototypeOf(Thinker)).call(this));
	
	    _this.initOption = _extend({}, Thinker.defaultOption, passInOption);
	    _this.initOption.apiPrefix = _this.initOption.apiPrefix.replace(/\/$/, '');
	    'canStartSyncNow sendRequest getDataToSync getAllDataToSync getItems updateLocalData deserializeItem'.split(' ').forEach(function (methodName) {
	      _this.initOption['_' + methodName + 'Async'] = utils.denodify(_this.initOption, methodName);
	    });
	
	    _this._nextSync = [];
	    _this._currentSync = [];
	    _this._syncCallbacks = [];
	
	    _this.once('backgroundInitializeCompletelySyncSucceed', function () {
	      _this.backgroundInitializeCompletelySyncSucceed = true;
	    });
	
	    // 如果后台完整同步在之前就已经完成了，那么告知调用者也是越早越好
	    if (_this.initOption.storage.getItem(CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY) === 'true') {
	      // @event backgroundInitializeCompletelySyncSucceed
	      _this.trigger('backgroundInitializeCompletelySyncSucceed');
	    }
	    return _this;
	  }
	
	  /**
	   * 发起同步，可以在任何时候调用，函数自己会确保同时只有一次同步正在工作，并且自动计划下一次同步
	   *
	   * @param {String}  reason - 触发同步的原因，会打印在日志中
	   * @param {ThinkerType~SyncOption}  passInOption - 同步相关设置，调用者也可以传入额外的内容以便在初始化 Thinker 时传入的所有回调函数中使用
	   * @param {ThinkerType~NodeLikeCallback} callback
	   *
	   * @function do
	   * @memberof Thinker#
	   */
	
	
	  _createClass(Thinker, [{
	    key: 'do',
	    value: function _do(reason, passInOption, cb) {
	      if (!reason) {
	        throw new Error('[Thinker] reason is required');
	      }
	
	      if (_includes(['waiting', 'succeed', 'failed'], this.status)) {
	        this.status = 'preparing';
	        // @event 'preparing'
	        this.trigger('preparing');
	        clearTimeout(this._statusBackToWaitingTimer);
	        this._syncCallbacks.push(cb);
	        this._currentSync.push({ reason: reason, passInOption: passInOption });
	        this._doDebounceTimer = setTimeout(this._fireSync.bind(this), this.initOption.debounceWait);
	      } else if (_includes(['preparing', 'blocking'], this.status)) {
	        clearTimeout(this._doDebounceTimer);
	        this._syncCallbacks.push(cb);
	        this._currentSync.push({ reason: reason, passInOption: passInOption });
	        this._doDebounceTimer = setTimeout(this._fireSync.bind(this), this.initOption.debounceWait);
	      } else {
	        this._syncCallbacks.push(cb);
	        this._nextSync.push({ reason: reason, passInOption: passInOption });
	      }
	    }
	  }, {
	    key: '_callSync',
	    value: function _callSync() {
	      var _this2 = this;
	
	      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	
	      var reasons = _map(this._currentSync, 'reason');
	      var passInOptions = _map(this._currentSync, 'passInOption');
	      var syncInfo = { passInOptions: passInOptions, isFirstTime: this.lastSuccessTime == null };
	      var option = _extend({ syncAllData: false }, { syncAllData: _some(passInOptions, 'syncAllData') });
	
	      this.status = 'blocking';
	      // @event 'blocking'
	      this.trigger('blocking');
	      return this._waitUntilCanSync(syncInfo).then(function () {
	        _this2.status = 'processing';
	        // @event 'processing'
	        _this2.trigger('processing');
	        _this2.initOption.logger.log('[Thinker] start(' + time + '), reasons: \n  - ' + reasons.join('\n  - '));
	        return _this2._doSync(syncInfo, option);
	      }).then(function () {
	        if (_isEmpty(_this2._nextSync)) {
	          return;
	        }
	        _this2._currentSync = _this2._nextSync;
	        _this2._nextSync = [];
	        return _this2._callSync(time + 1);
	      });
	    }
	  }, {
	    key: '_fireSync',
	    value: function _fireSync() {
	      var _this3 = this;
	
	      var autoSwitchStatus = function autoSwitchStatus() {
	        _this3._statusBackToWaitingTimer = setTimeout(function () {
	          _this3.status = 'waiting';
	          // @event 'waiting'
	          _this3.trigger('waiting');
	        }, 1000 * 2);
	      };
	
	      clearTimeout(this._doDebounceTimer);
	      this._doDebounceTimer = null;
	      this._callSync(1).then(function () {
	        var syncCallbacks = _this3._syncCallbacks;
	        _this3._syncCallbacks = [];
	        _this3.status = 'succeed';
	        // @event 'succeed'
	        _this3.trigger('succeed');
	        _this3.initOption.logger.log('[Thinker] succeed');
	        syncCallbacks.forEach(function (cb) {
	          return typeof cb === 'function' && cb();
	        });
	      }, function (err) {
	        var syncCallbacks = _this3._syncCallbacks;
	        _this3._syncCallbacks = [];
	        _this3.status = 'failed';
	        // @event 'failed'
	        _this3.trigger('failed', [err]);
	        _this3.initOption.logger.log('[Thinker] failed');
	        syncCallbacks.forEach(function (cb) {
	          return typeof cb === 'function' && cb(err);
	        });
	      }).then(autoSwitchStatus, autoSwitchStatus);
	    }
	
	    /**
	     * 用于确认是否正在一次同步中
	     *
	     * @function isDoing
	     * @memberof Thinker#
	     * @return {Boolean}
	     */
	
	  }, {
	    key: 'isDoing',
	    value: function isDoing() {
	      return _includes(['preparing', 'blocking', 'processing']);
	    }
	  }, {
	    key: '_waitUntilCanSync',
	    value: function _waitUntilCanSync(syncInfo) {
	      var _this4 = this;
	
	      var tryStartSync = function tryStartSync() {
	        _this4.initOption._canStartSyncNowAsync(syncInfo).then(function (canStartSyncNow) {
	          if (canStartSyncNow === true) {
	            defer.resolve();
	          } else {
	            var reason = _isString(canStartSyncNow) ? canStartSyncNow : 'some reason';
	            _this4.initOption.logger.log('[Thinker] sync blocked by ' + reason + ', will try again after ' + _this4.initOption.debounceWait / 1000 + ' seconds');
	            setTimeout(tryStartSync, _this4.initOption.debounceWait);
	          }
	        });
	      };
	
	      var defer = utils.pending();
	      tryStartSync();
	      return defer.promise;
	    }
	  }, {
	    key: '_doSync',
	    value: function _doSync(syncInfo, option) {
	      var _this5 = this;
	
	      var getDataMethodName = option.syncAllData ? '_getAllDataToSyncAsync' : '_getDataToSyncAsync';
	      return this.initOption[getDataMethodName](syncInfo).then(function (data) {
	        var requestUrl = _this5.initOption.apiPrefix + '/account/sync';
	        var requestData = void 0;
	        if (syncInfo.isFirstTime) {
	          // 如果是第一次同步，那么需要指定只同步最近一个月的数据
	          requestData = { fast_from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).toJSON(), objects: {} };
	        } else {
	          requestData = { last_sync: _this5.lastSuccessTime.toJSON(), objects: data };
	        }
	        var requestConfig = { url: requestUrl, method: 'POST', data: requestData, params: null };
	
	        if (_this5.initOption.autoRetryRequestCount) {
	          // TODO: 当第二次同步请求发出时，取消之前的 delayRetry
	          return utils.delayRetry(function (retryTime) {
	            _this5.initOption.logger.log('[Thinker] request retry(' + retryTime + ')', requestConfig);
	            return _this5.initOption._sendRequestAsync(syncInfo, _cloneDeep(requestConfig)).then(function (resp) {
	              resp.config = requestConfig;
	              return resp;
	            }, function (err) {
	              _this5.initOption.logger.error('[Thinker] request failed(' + retryTime + ')', err);
	              return Promise.reject(err);
	            });
	          }, { maxRetryCount: _this5.initOption.autoRetryRequestCount });
	        } else {
	          return _this5.initOption._sendRequestAsync(syncInfo, _cloneDeep(requestConfig)).then(function (resp) {
	            resp.config = requestConfig;
	            return resp;
	          });
	        }
	      }).then(function (resp) {
	        // 有时后端会响应一个空白，这时就代表数据出错或者后端出错了
	        if (!resp.data) {
	          throw new errors.ResponseEntityEmptyError(resp);
	        }
	        return _this5._updateLocalData(syncInfo, resp).then(function () {
	          return resp;
	        });
	      }, function (resp) {
	        // 服务端写入数据出错/冲突就会返回 507 ，但这种错误客户端是可以自己消化掉的
	        // 所以不抛出错误，继续下一步
	        if (resp.status !== 507) {
	          throw new errors.SyncFailedError(resp);
	        }
	        return _this5._updateLocalData(syncInfo, resp).then(function () {
	          return resp;
	        });
	      }).then(function (resp) {
	        var newLastSyncTime = utils.parseValidDate(resp.data.last_sync) == null || new Date();
	        _this5.initOption.storage.setItem(CONSTS.LAST_SYNC_STORAGE_KEY, newLastSyncTime.getTime());
	        _this5.initOption.storage.removeItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY);
	        return resp;
	      }).catch(function (err) {
	        if (_this5.initOption.storage.getItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY)) {
	          _this5.initOption.storage.setItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY, new Date().getTime());
	        }
	        return Promise.reject(err);
	      }).then(function (arg) {
	        if (syncInfo.isFirstTime && _this5.initOption.autoBackgroundCompletelySync) {
	          var _option = { syncAllData: true };
	          var _syncInfo = { passInOptions: [_option], isFirstTime: false };
	          _this5._doSync(_syncInfo, _option).then(function () {
	            _this5.initOption.storage.setItem(CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY, 'true');
	            _this5.trigger('backgroundInitializeCompletelySyncSucceed');
	          });
	        }
	        return arg;
	      });
	    }
	  }, {
	    key: '_decideAction',
	    value: function _decideAction(serverItem, localItem, requestItem, isServerSaveFailed) {
	      var requestItemUpdatedAt = requestItem && requestItem.updated_at ? new Date(requestItem.updated_at).valueOf() : undefined;
	      var localItemUpdatedAt = localItem && localItem.updated_at ? new Date(localItem.updated_at).valueOf() : undefined;
	      var serverItemUpdatedAt = serverItem && serverItem.updated_at ? new Date(serverItem.updated_at).valueOf() : undefined;
	
	      if (!localItem) {
	        return serverItem ? 'new' : 'doNothing';
	      } else if (!serverItem) {
	        if (isServerSaveFailed) {
	          return 'doNothing';
	        } else if (!requestItem) {
	          return 'doNothing';
	          // moment(localItem.updated_at).isAfter(requestItem.updated_at)
	        } else if (localItemUpdatedAt > requestItemUpdatedAt) {
	          return 'doNothing';
	        } else if (localItemUpdatedAt === requestItemUpdatedAt) {
	          return 'cleanDirty';
	        } else {
	          return 'doNothing';
	        }
	        // moment(localItem.updated_at).isAfter(serverItem.updated_at)
	      } else if (localItemUpdatedAt > serverItemUpdatedAt) {
	        return 'doNothing';
	      } else if (localItemUpdatedAt === serverItemUpdatedAt) {
	        // 不排除更新时间存在时区信息的情况，所以需要转换成时间戳来对比，这种情况下如果
	        // 服务器那边也没有出错，那就说明服务器认为这个应该被更新，那就以服务器为准
	        return isServerSaveFailed ? 'doNothing' : 'update';
	      } else {
	        return 'update';
	      }
	    }
	  }, {
	    key: '_updateLocalData',
	    value: function _updateLocalData(syncInfo, resp) {
	      var _this6 = this;
	
	      var requestData = resp.config.data.objects;
	      var serverData = resp.data.objects;
	
	      var itemIds = {};
	      _reduce(requestData, pickObjectsIds, itemIds);
	      _reduce(serverData, pickObjectsIds, itemIds);
	      return this.initOption._getItemsAsync(syncInfo, itemIds).then(function (localData) {
	        var groupedPromises = _mapValues(localData, function (localItems, type) {
	          var serverItems = serverData[type];
	          var requestItems = requestData[type];
	          if (type === 'todo_order') {
	            var serverSaveFailed = _includes(resp.data.failures, "todo_order");
	            var action = _this6._decideAction(serverItems, localItems, requestItems, serverSaveFailed);
	            var actionData = void 0;
	            switch (action) {
	              case 'doNothing':
	                actionData = localItems;
	                break;
	              case 'cleanDirty':
	                actionData = requestItems;
	                break;
	              case 'change':
	              case 'new':
	                actionData = serverItems;
	                break;
	            }
	            return _defineProperty({}, action, actionData);
	            // 如果 failure 里出现 ObjectType 的话，那就不用检查 resp.data.objects 了
	          } else if (_includes(resp.data.failures, type)) {
	            var requestItemsMappedLocalItems = void 0;
	            // 所有 requestItem 对应的 localItem 都 keepDirty 就好了
	            if (requestItems != null) {
	              requestItemsMappedLocalItems = _reduce(localItems, function (memo, localItem, id) {
	                if (requestItems[id] != null) {
	                  memo[id] = localItem;
	                }
	                return memo;
	              }, {});
	            } else {
	              requestItemsMappedLocalItems = {};
	            }
	            return { keepDirty: requestItemsMappedLocalItems };
	          } else {
	            var deserializingActionPromiseGroups = _reduce(itemIds[type], function (memo, itemId) {
	              var serverItem = serverItems != null ? serverItems[itemId] : undefined;
	              var requestItem = requestItems != null ? requestItems[itemId] : undefined;
	              var localItem = localItems != null ? localItems[itemId] : undefined;
	              var serverSaveFailed = _includes(resp.data.failures, type + ':' + itemId);
	              var action = _this6._decideAction(serverItem, localItem, requestItem, serverSaveFailed);
	              if (!memo[action]) {
	                memo[action] = {};
	              }
	              memo[action][itemId] = _this6.initOption._deserializeItemAsync(type, action, requestItem, localItem, serverItem);
	              return memo;
	            }, {});
	            var deserializingActionGroups = _reduce(deserializingActionPromiseGroups, function (memo, promises, action) {
	              memo[action] = utils.props(promises);
	              return memo;
	            }, {});
	            return utils.props(deserializingActionGroups);
	          }
	        });
	        return utils.props(groupedPromises);
	      }).then(function (groupedData) {
	        _forEach(groupedData, function (groupedItems, type) {
	          _forEach(groupedItems, function (items, action) {
	            if (_isEmpty(items)) {
	              delete groupedItems[action];
	            }
	          });
	        });
	        return _this6.initOption._updateLocalDataAsync(syncInfo, groupedData).then(function () {
	          return resp;
	        });
	      });
	    }
	  }]);
	
	  return Thinker;
	}(EventEmitter);
	
	Thinker.defaultOption = defaultOption;
	
	definePrototype(Thinker);
	
	_forEach(errors, function (Error, errName) {
	  Thinker[errName] = Error;
	});
	
	module.exports = Thinker;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * EventEmitter v5.1.0 - git.io/ee
	 * Unlicense - http://unlicense.org/
	 * Oliver Caldwell - http://oli.me.uk/
	 * @preserve
	 */
	
	;(function (exports) {
	    'use strict';
	
	    /**
	     * Class for managing events.
	     * Can be extended to provide event functionality in other classes.
	     *
	     * @class EventEmitter Manages event registering and emitting.
	     */
	    function EventEmitter() {}
	
	    // Shortcuts to improve speed and size
	    var proto = EventEmitter.prototype;
	    var originalGlobalValue = exports.EventEmitter;
	
	    /**
	     * Finds the index of the listener for the event in its storage array.
	     *
	     * @param {Function[]} listeners Array of listeners to search through.
	     * @param {Function} listener Method to look for.
	     * @return {Number} Index of the specified listener, -1 if not found
	     * @api private
	     */
	    function indexOfListener(listeners, listener) {
	        var i = listeners.length;
	        while (i--) {
	            if (listeners[i].listener === listener) {
	                return i;
	            }
	        }
	
	        return -1;
	    }
	
	    /**
	     * Alias a method while keeping the context correct, to allow for overwriting of target method.
	     *
	     * @param {String} name The name of the target method.
	     * @return {Function} The aliased method
	     * @api private
	     */
	    function alias(name) {
	        return function aliasClosure() {
	            return this[name].apply(this, arguments);
	        };
	    }
	
	    /**
	     * Returns the listener array for the specified event.
	     * Will initialise the event object and listener arrays if required.
	     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	     * Each property in the object response is an array of listener functions.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Function[]|Object} All listener functions for the event.
	     */
	    proto.getListeners = function getListeners(evt) {
	        var events = this._getEvents();
	        var response;
	        var key;
	
	        // Return a concatenated array of all matching events if
	        // the selector is a regular expression.
	        if (evt instanceof RegExp) {
	            response = {};
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    response[key] = events[key];
	                }
	            }
	        }
	        else {
	            response = events[evt] || (events[evt] = []);
	        }
	
	        return response;
	    };
	
	    /**
	     * Takes a list of listener objects and flattens it into a list of listener functions.
	     *
	     * @param {Object[]} listeners Raw listener objects.
	     * @return {Function[]} Just the listener functions.
	     */
	    proto.flattenListeners = function flattenListeners(listeners) {
	        var flatListeners = [];
	        var i;
	
	        for (i = 0; i < listeners.length; i += 1) {
	            flatListeners.push(listeners[i].listener);
	        }
	
	        return flatListeners;
	    };
	
	    /**
	     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Object} All listener functions for an event in an object.
	     */
	    proto.getListenersAsObject = function getListenersAsObject(evt) {
	        var listeners = this.getListeners(evt);
	        var response;
	
	        if (listeners instanceof Array) {
	            response = {};
	            response[evt] = listeners;
	        }
	
	        return response || listeners;
	    };
	
	    function isValidListener (listener) {
	        if (typeof listener === 'function' || listener instanceof RegExp) {
	            return true
	        } else if (listener && typeof listener === 'object') {
	            return isValidListener(listener.listener)
	        } else {
	            return false
	        }
	    }
	
	    /**
	     * Adds a listener function to the specified event.
	     * The listener will not be added if it is a duplicate.
	     * If the listener returns true then it will be removed after it is called.
	     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListener = function addListener(evt, listener) {
	        if (!isValidListener(listener)) {
	            throw new TypeError('listener must be a function');
	        }
	
	        var listeners = this.getListenersAsObject(evt);
	        var listenerIsWrapped = typeof listener === 'object';
	        var key;
	
	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
	                listeners[key].push(listenerIsWrapped ? listener : {
	                    listener: listener,
	                    once: false
	                });
	            }
	        }
	
	        return this;
	    };
	
	    /**
	     * Alias of addListener
	     */
	    proto.on = alias('addListener');
	
	    /**
	     * Semi-alias of addListener. It will add a listener that will be
	     * automatically removed after its first execution.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addOnceListener = function addOnceListener(evt, listener) {
	        return this.addListener(evt, {
	            listener: listener,
	            once: true
	        });
	    };
	
	    /**
	     * Alias of addOnceListener.
	     */
	    proto.once = alias('addOnceListener');
	
	    /**
	     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	     * You need to tell it what event names should be matched by a regex.
	     *
	     * @param {String} evt Name of the event to create.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvent = function defineEvent(evt) {
	        this.getListeners(evt);
	        return this;
	    };
	
	    /**
	     * Uses defineEvent to define multiple events.
	     *
	     * @param {String[]} evts An array of event names to define.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvents = function defineEvents(evts) {
	        for (var i = 0; i < evts.length; i += 1) {
	            this.defineEvent(evts[i]);
	        }
	        return this;
	    };
	
	    /**
	     * Removes a listener function from the specified event.
	     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to remove the listener from.
	     * @param {Function} listener Method to remove from the event.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListener = function removeListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var index;
	        var key;
	
	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key)) {
	                index = indexOfListener(listeners[key], listener);
	
	                if (index !== -1) {
	                    listeners[key].splice(index, 1);
	                }
	            }
	        }
	
	        return this;
	    };
	
	    /**
	     * Alias of removeListener
	     */
	    proto.off = alias('removeListener');
	
	    /**
	     * Adds listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	     * You can also pass it a regular expression to add the array of listeners to all events that match it.
	     * Yeah, this function does quite a bit. That's probably a bad thing.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListeners = function addListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(false, evt, listeners);
	    };
	
	    /**
	     * Removes listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be removed.
	     * You can also pass it a regular expression to remove the listeners from all events that match it.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListeners = function removeListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(true, evt, listeners);
	    };
	
	    /**
	     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	     * The first argument will determine if the listeners are removed (true) or added (false).
	     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be added/removed.
	     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	     *
	     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
	        var i;
	        var value;
	        var single = remove ? this.removeListener : this.addListener;
	        var multiple = remove ? this.removeListeners : this.addListeners;
	
	        // If evt is an object then pass each of its properties to this method
	        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
	            for (i in evt) {
	                if (evt.hasOwnProperty(i) && (value = evt[i])) {
	                    // Pass the single listener straight through to the singular method
	                    if (typeof value === 'function') {
	                        single.call(this, i, value);
	                    }
	                    else {
	                        // Otherwise pass back to the multiple function
	                        multiple.call(this, i, value);
	                    }
	                }
	            }
	        }
	        else {
	            // So evt must be a string
	            // And listeners must be an array of listeners
	            // Loop over it and pass each one to the multiple method
	            i = listeners.length;
	            while (i--) {
	                single.call(this, evt, listeners[i]);
	            }
	        }
	
	        return this;
	    };
	
	    /**
	     * Removes all listeners from a specified event.
	     * If you do not specify an event then all listeners will be removed.
	     * That means every event will be emptied.
	     * You can also pass a regex to remove all events that match it.
	     *
	     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeEvent = function removeEvent(evt) {
	        var type = typeof evt;
	        var events = this._getEvents();
	        var key;
	
	        // Remove different things depending on the state of evt
	        if (type === 'string') {
	            // Remove all listeners for the specified event
	            delete events[evt];
	        }
	        else if (evt instanceof RegExp) {
	            // Remove all events matching the regex.
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    delete events[key];
	                }
	            }
	        }
	        else {
	            // Remove all listeners in all events
	            delete this._events;
	        }
	
	        return this;
	    };
	
	    /**
	     * Alias of removeEvent.
	     *
	     * Added to mirror the node API.
	     */
	    proto.removeAllListeners = alias('removeEvent');
	
	    /**
	     * Emits an event of your choice.
	     * When emitted, every listener attached to that event will be executed.
	     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	     * So they will not arrive within the array on the other side, they will be separate.
	     * You can also pass a regular expression to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {Array} [args] Optional array of arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emitEvent = function emitEvent(evt, args) {
	        var listenersMap = this.getListenersAsObject(evt);
	        var listeners;
	        var listener;
	        var i;
	        var key;
	        var response;
	
	        for (key in listenersMap) {
	            if (listenersMap.hasOwnProperty(key)) {
	                listeners = listenersMap[key].slice(0);
	
	                for (i = 0; i < listeners.length; i++) {
	                    // If the listener returns true then it shall be removed from the event
	                    // The function is executed either with a basic call or an apply if there is an args array
	                    listener = listeners[i];
	
	                    if (listener.once === true) {
	                        this.removeListener(evt, listener.listener);
	                    }
	
	                    response = listener.listener.apply(this, args || []);
	
	                    if (response === this._getOnceReturnValue()) {
	                        this.removeListener(evt, listener.listener);
	                    }
	                }
	            }
	        }
	
	        return this;
	    };
	
	    /**
	     * Alias of emitEvent
	     */
	    proto.trigger = alias('emitEvent');
	
	    /**
	     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {...*} Optional additional arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emit = function emit(evt) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return this.emitEvent(evt, args);
	    };
	
	    /**
	     * Sets the current value to check against when executing listeners. If a
	     * listeners return value matches the one set here then it will be removed
	     * after execution. This value defaults to true.
	     *
	     * @param {*} value The new value to check for when executing listeners.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.setOnceReturnValue = function setOnceReturnValue(value) {
	        this._onceReturnValue = value;
	        return this;
	    };
	
	    /**
	     * Fetches the current value to check against when executing listeners. If
	     * the listeners return value matches this one then it should be removed
	     * automatically. It will return true by default.
	     *
	     * @return {*|Boolean} The current value to check for or the default, true.
	     * @api private
	     */
	    proto._getOnceReturnValue = function _getOnceReturnValue() {
	        if (this.hasOwnProperty('_onceReturnValue')) {
	            return this._onceReturnValue;
	        }
	        else {
	            return true;
	        }
	    };
	
	    /**
	     * Fetches the events object and creates one if required.
	     *
	     * @return {Object} The events storage object.
	     * @api private
	     */
	    proto._getEvents = function _getEvents() {
	        return this._events || (this._events = {});
	    };
	
	    /**
	     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	     *
	     * @return {Function} Non conflicting EventEmitter class.
	     */
	    EventEmitter.noConflict = function noConflict() {
	        exports.EventEmitter = originalGlobalValue;
	        return EventEmitter;
	    };
	
	    // Expose the class either via AMD, CommonJS or the global object
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return EventEmitter;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	    else if (typeof module === 'object' && module.exports){
	        module.exports = EventEmitter;
	    }
	    else {
	        exports.EventEmitter = EventEmitter;
	    }
	}(this || {}));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extend = __webpack_require__(4);
	var _map = __webpack_require__(5);
	var _toPairs = __webpack_require__(6);
	var _fromPairs = __webpack_require__(7);
	var _isString = __webpack_require__(8);
	
	var utils = {
	  denodify: function denodify(owner, fnName) {
	    return function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      return new Promise(function (resolve, reject) {
	        owner[fnName].apply(owner, args.concat(function (err, result) {
	          err ? reject(err) : resolve(result);
	        }));
	      });
	    };
	  },
	  props: function props(promises) {
	    var pairedPromises = _toPairs(promises);
	    return Promise.all(_map(pairedPromises, function (pair) {
	      return pair[1];
	    })).then(function (results) {
	      var pairedResults = results.reduce(function (memo, result, index) {
	        memo[index] = [pairedPromises[index][0], result];
	        return memo;
	      }, []);
	      return _fromPairs(pairedResults);
	    });
	  },
	  pending: function pending() {
	    var result = {};
	    result.promise = new Promise(function (resolve, reject) {
	      result.resolve = resolve;
	      result.reject = reject;
	    });
	    return result;
	  },
	
	
	  // 1,  3,  30,  90, 900, 2700, 27000, 81000, 810000
	  // 1s, 3s, 30s, 3m, 15m, 45m , 7.5h , 22.5h,   225h
	  // 0.1, lastResult * 10, lastResult * 3, lastResult * 10, lastResult * 3, lastResult * 10, ...
	  //
	  // @param {Function} fn - 要自动重试的函数
	  // @param {Object} passInOption
	  // @param {Number} passInOption.maxRetryCount - 最大自动重试数，如果为 0 就无限重试，默认为 5
	  // @return {Promsie} promise
	  // @return {Function} promise.cancel - 终止重试流程
	  delayRetry: function () {
	    var defaultOption = { maxRetryCount: 5 };
	
	    return function (fn, passInOption, _internalState) {
	      fn = typeof fn === 'function' ? fn : function () {};
	      _internalState = _internalState || { retriedTimes: 0, lastOutSecond: 0.1, canceled: false };
	      var option = _extend({}, defaultOption, passInOption);
	
	      var promise = Promise.resolve(fn(_internalState.retriedTimes + 1)).catch(function (err) {
	        if (_internalState.retriedTimes >= option.maxRetryCount || _internalState.canceled) {
	          return Promise.reject(err);
	        } else {
	          _internalState.retriedTimes += 1;
	          _internalState.lastOutSecond = _internalState.lastOutSecond * (_internalState.retriedTimes % 2 ? 10 : 3);
	          return new Promise(function (resolve, reject) {
	            setTimeout(function () {
	              utils.delayRetry(fn, option, _internalState).then(resolve, reject);
	            }, _internalState.lastOutSecond * 1000);
	          });
	        }
	      });
	
	      promise.cancel = function () {
	        _internalState.canceled = true;
	      };
	
	      return promise;
	    };
	  }(),
	
	  parseValidDate: function parseValidDate(obj) {
	    var date = void 0;
	    if (Object.prototype.toString.call(obj) === '[object Date]') {
	      date = obj;
	    } else if (_isString(obj) && /^\d+$/.test(obj)) {
	      date = new Date(parseInt(obj, 10));
	    } else {
	      date = new Date(obj);
	    }
	    return isNaN(date.getTime()) ? null : date;
	  }
	};
	
	module.exports = utils;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var CONSTS = __webpack_require__(10);
	var utils = __webpack_require__(3);
	var _extend = __webpack_require__(4);
	
	module.exports = function (Thinker) {
	  _extend(Thinker.prototype, {
	    /**
	     * 当前同步状态
	     *
	     * `status` 属性的值各自代表的阶段如下：
	     *   * `waiting`: 等待触发同步
	     *   * `preparing`: 同步已经在计划中，但还没开始，此时调用 `do()` 都会在同步正式开始时合并为一次请求
	     *   * `blocking`: 同步已经在计划中，但因为客户端阻止所以还没开始，此时调用 `do()` 都会在同步正式开始时合并为一次请求
	     *   * `processing`: 同步已经开始，此时调用 `do()` 会自动计划下一次同步
	     *   * `succeed` | `failed`: 同步完成或者失败
	     *
	     * @type {String}
	     * @alias status
	     * @memberof Thinker#
	     */
	    status: 'waiting',
	
	    /**
	     * 是否已经完成了后台初次完整同步
	     *
	     * @type {Boolean}
	     * @alias backgroundInitializeCompletelySyncSucceed
	     * @memberof Thinker#
	     */
	    backgroundInitializeCompletelySyncSucceed: false
	  });
	
	  Object.defineProperties(Thinker.prototype, {
	    /**
	     * 最后一次同步成功的时间
	     *
	     * @type {Date}
	     * @alias lastSuccessTime
	     * @memberof Thinker#
	     */
	    lastSuccessTime: {
	      get: function get() {
	        return utils.parseValidDate(this.initOption.storage.getItem(CONSTS.LAST_SYNC_STORAGE_KEY));
	      }
	    },
	
	    /**
	     * 最后一次同步失败的时间
	     *
	     * @type {Date}
	     * @alias lastFailTime
	     * @memberof Thinker#
	     */
	    lastFailTime: {
	      get: function get() {
	        return utils.parseValidDate(this.initOption.storage.getItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY));
	      }
	    }
	  });
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY: 'ds_localdb_init_completely_synced',
	  LAST_SYNC_STORAGE_KEY: 'ds_localdb_last_sync',
	  LAST_SYNC_FAIL_STORAGE_KEY: 'app_last_sync_failed_time'
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var Logger = __webpack_require__(12);
	var MemoryStorage = __webpack_require__(13);
	var root = void 0;
	try {
	  root = window || global || {};
	} catch (err) {
	  root = {};
	}
	
	/**
	 * 默认的初始化设置项
	 *
	 * @property {String} [apiPrefix=https://api-ng.pomotodo.com] - 发起同步时要请求的服务器地址
	 * @property {Number} [debounceWait=5000] - 在多久时间内多次调用 `do()` 会合并为一次同步请求，单位：秒
	 * @property {Thinker~Logger} logger - 日志收集器
	 * @property {Storage} storage - 读写本地存储，实现了 {@link https://developer.mozilla.org/en-US/docs/Web/API/Storage Storage 接口}的对象
	 * @property {Boolean} [autoBackgroundCompletelySync=true] - 是否自动发起后台初次完整同步
	 * @property {Number} [autoRetryRequestCount=5] - 发起同步请求失败后重试几次
	 *
	 * @property {Function} canStartSyncNow
	 * @property {Function} sendRequest
	 * @property {Function} getDataToSync
	 * @property {Function} getAllDataToSync
	 * @property {Function} getItems
	 * @property {Function} updateLocalData
	 *
	 * @namespace
	 * @name defaultOption
	 * @memberof Thinker
	 */
	module.exports = {
	  apiPrefix: 'https://api-ng.pomotodo.com',
	  debounceWait: 1000 * 5,
	  logger: new Logger(),
	  storage: root.localStorage || new MemoryStorage(),
	  autoBackgroundCompletelySync: true,
	  autoRetryRequestCount: 5,
	
	  /**
	   * 从客户端了解是否可以立即开始同步
	   *
	   * @param {ThinkerType~SyncInfo} syncInfo
	   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error, {Boolean | String})` ，第二个参数只有在为 `true` 时才会不阻塞同步，否则会被当作阻塞理由打印在日志中
	   *
	   * @alias Thinker.defaultOption.canStartSyncNow
	   * @memberof Thinker
	   */
	  canStartSyncNow: function canStartSyncNow(syncInfo, callback) {
	    callback(null, true);
	  },
	
	
	  /**
	   * 让客户端发起 HTTP 请求，并按照格式返回
	   *
	   * @param {ThinkerType~SyncInfo} syncInfo
	   * @param {ThinkerType~RequestInfo} requestInfo
	   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error, {@link ThinkerType~ResponseInfo})`
	   *
	   * @alias Thinker.defaultOption.sendRequest
	   * @memberof Thinker
	   */
	  sendRequest: function sendRequest(syncInfo, requestInfo, callback) {
	    callback(null, { config: requestInfo, status: 200, headers: {}, data: {} });
	  },
	
	
	  /**
	   * 从客户端获取普通同步需要的数据
	   *
	   * @param {ThinkerType~SyncInfo} syncInfo
	   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
	   *
	   * @alias Thinker.defaultOption.getDataToSync
	   * @memberof Thinker
	   */
	  getDataToSync: function getDataToSync(syncInfo, callback) {
	    callback(null);
	  },
	
	
	  /**
	   * 从客户端获取完整同步需要的数据
	   *
	   * @param {ThinkerType~SyncInfo} syncInfo
	   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
	   *
	   * @alias Thinker.defaultOption.getAllDataToSync
	   * @memberof Thinker
	   */
	  getAllDataToSync: function getAllDataToSync(syncInfo, callback) {
	    callback(null);
	  },
	
	
	  /**
	   * 从客户端获取指定类型的指定条目
	   *
	   * @param {ThinkerType~SyncInfo} syncInfo
	   * @param {ThinkerType~ObjectIdSet} ids
	   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error, {@link ThinkerType~ObjectSet})`
	   *
	   * @alias Thinker.defaultOption.getItems
	   * @memberof Thinker
	   */
	  getItems: function getItems(syncInfo, ids, callback) {
	    callback(null, []);
	  },
	
	
	  /**
	   * 要求客户端根据处理过的服务器返回值更新本地数据库
	   *
	   * @param {ThinkerType~SyncInfo} syncInfo
	   * @param {ThinkerType~GroupedObjectSet} data
	   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
	   *
	   * @alias Thinker.defaultOption.updateLocalData
	   * @memberof Thinker
	   */
	  updateLocalData: function updateLocalData(syncInfo, data, callback) {
	    callback(null);
	  },
	
	
	  /**
	   * 要求客户端根据处理过的服务器返回值更新本地数据库
	   *
	   * @param {ThinkerType~SyncInfo} syncInfo
	   * @param {ThinkerType~ObjectType} objectType
	   * @param {ThinkerType~ObjectAction} objectAction
	   * @param {?Object} requestObject
	   * @param {?Object} localObject
	   * @param {?Object} serverObject
	   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
	   *
	   * @alias Thinker.defaultOption.deserializeItem
	   * @memberof Thinker
	   */
	  deserializeItem: function deserializeItem(syncInfo, objectType, objectAction, requestObject, localObject, serverObject, callback) {
	    callback(null, serverObject);
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * @interface Thinker~Logger
	 * @memberof Thinker
	 */
	var Logger = function () {
	  function Logger() {
	    _classCallCheck(this, Logger);
	  }
	
	  _createClass(Logger, [{
	    key: "log",
	
	    /**
	     * 打印普通日志
	     *
	     * @function
	     * @name log
	     * @param {...*} message
	     * @memberof Thinker~Logger#
	     */
	    value: function log() {
	      var _console;
	
	      return (_console = console).log.apply(_console, arguments);
	    }
	
	    /**
	     * 打印错误日志
	     *
	     * @function
	     * @name error
	     * @param {...*} message
	     * @memberof Thinker~Logger#
	     */
	
	  }, {
	    key: "error",
	    value: function error() {
	      var _console2;
	
	      return (_console2 = console).log.apply(_console2, arguments);
	    }
	  }]);
	
	  return Logger;
	}();
	
	module.exports = Logger;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MemoryStorage = function () {
	  function MemoryStorage() {
	    _classCallCheck(this, MemoryStorage);
	
	    this.store = {};
	  }
	
	  _createClass(MemoryStorage, [{
	    key: "key",
	    value: function key(index) {
	      return Object.keys(this.store)[index];
	    }
	  }, {
	    key: "getItem",
	    value: function getItem(key) {
	      return this.store[key];
	    }
	  }, {
	    key: "setItem",
	    value: function setItem(key, value) {
	      this.store[key] = value;
	    }
	  }, {
	    key: "removeItem",
	    value: function removeItem(key) {
	      delete this.store[key];
	    }
	  }, {
	    key: "clear",
	    value: function clear() {
	      this.store = {};
	    }
	  }, {
	    key: "length",
	    get: function get() {
	      return Object.keys(this.store).length;
	    }
	  }]);
	
	  return MemoryStorage;
	}();
	
	module.exports = MemoryStorage;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * @class SyncFailedError
	 * @extends Error
	 * @memberof Thinker
	 */
	var SyncFailedError =
	/**
	 * @var response {ThinkerType~ResponseInfo}
	 * @memberof Thinker.errors.SyncFailedError#
	 */
	function SyncFailedError(response) {
	  _classCallCheck(this, SyncFailedError);
	
	  this.response = response;
	  if (typeof Error.captureStackTrace === "function") {
	    Error.captureStackTrace(this, this.constructor);
	  }
	  this.name = 'SyncFailedError';
	  this.message = 'Sync failed';
	};
	
	SyncFailedError.prototype = Object.create(Error.prototype);
	SyncFailedError.prototype.constructor = SyncFailedError;
	
	/**
	 * @class SyncBeCanceledError
	 * @extends Error
	 * @memberof Thinker
	 */
	
	var SyncBeCanceledError =
	/**
	 * @var response {ThinkerType~ResponseInfo}
	 * @memberof Thinker.errors.SyncBeCanceledError#
	 */
	function SyncBeCanceledError(response) {
	  _classCallCheck(this, SyncBeCanceledError);
	
	  this.response = response;
	  if (typeof Error.captureStackTrace === "function") {
	    Error.captureStackTrace(this, this.constructor);
	  }
	  this.name = 'SyncBeCanceledError';
	  this.message = 'Sync failed';
	};
	
	SyncBeCanceledError.prototype = Object.create(Error.prototype);
	SyncBeCanceledError.prototype.constructor = SyncBeCanceledError;
	
	/**
	 * @class ResponseEntityEmptyError
	 * @extends Error
	 * @memberof Thinker
	 */
	
	var ResponseEntityEmptyError =
	/**
	 * @var response {ThinkerType~ResponseInfo}
	 * @memberof Thinker.errors.ResponseEntityEmptyError#
	 */
	function ResponseEntityEmptyError(response) {
	  _classCallCheck(this, ResponseEntityEmptyError);
	
	  this.response = response;
	  if (typeof Error.captureStackTrace === "function") {
	    Error.captureStackTrace(this, this.constructor);
	  }
	  this.name = 'ResponseEntityEmptyError';
	  this.message = 'Response entity is empty';
	};
	
	ResponseEntityEmptyError.prototype = Object.create(Error.prototype);
	ResponseEntityEmptyError.prototype.constructor = ResponseEntityEmptyError;
	
	module.exports = {
	  SyncFailedError: SyncFailedError,
	  SyncBeCanceledError: SyncBeCanceledError,
	  ResponseEntityEmptyError: ResponseEntityEmptyError
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_15__;

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_16__;

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_17__;

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_18__;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_19__;

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_20__;

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_21__;

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_22__;

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_23__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=main.js.map