const EventEmitter = require('wolfy87-eventemitter')
const utils = require('./utils')
const definePrototype = require('./define_prototype')
const defaultOption = require('./default_option')
const errors = require('./errors')
const CONSTS = require('./constants')

const _keys = require('lodash/keys')
const _extend = require('lodash/extend')
const _includes = require('lodash/includes')
const _forEach = require('lodash/forEach')
const _map = require('lodash/map')
const _isEmpty = require('lodash/isEmpty')
const _some = require('lodash/some')
const _reduce = require('lodash/reduce')
const _filter = require('lodash/filter')
const _mapValues = require('lodash/mapValues')
const _isString = require('lodash/isString')
const _cloneDeep = require('lodash/cloneDeep')

const pickObjectsIds = (memo, items, type) => {
  if (type === 'todo_order') {
    memo[type] = []
  } else {
    memo[type] = (memo[type] || []).concat(_keys(items))
  }
  return memo
}

/**
 * 监听事件
 *
 * @param {string} eventName - 事件名称
 * @param {Function} callback - 回调函数
 *
 * @function on
 * @memberof Thinker#
 */

/**
 * 取消监听事件
 *
 * @param {string} eventName - 事件名称
 * @param {Function} callback - 回调函数
 *
 * @function off
 * @memberof Thinker#
 */

class Thinker extends EventEmitter {
  /**
   * @constructs Thinker
   * @param {Object} passInOption
   * @see {@link Thinker.defaultOption}
   */
  constructor(passInOption) {
    super()

    this.initOption = _extend({}, Thinker.defaultOption, passInOption)
    this.initOption.apiPrefix = this.initOption.apiPrefix.replace(/\/$/, '')
    'canStartSyncNow sendRequest getDataToSync getAllDataToSync getItems updateLocalData deserializeItem'.split(' ').forEach((methodName) => {
      this.initOption[`_${methodName}Async`] = utils.denodify(this.initOption, methodName)
    })

    this._nextSync = []
    this._currentSync = []
    this._syncCallbacks = []
    this._doDebounceTimer = null
    this._statusBackToWaitingTimer = null
    this._doSyncRetryInfo = null

    this.once('backgroundInitializeCompletelySyncSucceed', () => {
      this.backgroundInitializeCompletelySyncSucceed = true
    })

    // 如果后台完整同步在之前就已经完成了，那么告知调用者也是越早越好
    if (this.initOption.storage.getItem(CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY) === 'true') {
      /**
       * 在后台初次完整同步后触发
       *
       * @event Thinker#backgroundInitializeCompletelySyncSucceed
       */
      this.trigger('backgroundInitializeCompletelySyncSucceed')
    }
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
  do(reason, passInOption, cb) {
    if (!reason) {
      throw new Error('[Thinker] reason is required')
    }

    let debounceSeconds = this.initOption.debounce
    if (passInOption && passInOption.debounce !== null) {
      debounceSeconds = passInOption.debounce
    }

    if (_includes(['waiting', 'succeed', 'failed'], this.status)) {
      /**
       * `Thinker#status` 变为 `preparing` 时触发
       *
       * @event Thinker#preparing
       */
      this._changeStatus('preparing')
      clearTimeout(this._statusBackToWaitingTimer)
      this._syncCallbacks.push(cb)
      this._currentSync.push({reason, passInOption})
      this._doDebounceTimer = setTimeout(this._fireSync.bind(this), debounceSeconds)
    } else if (_includes(['preparing', 'blocking'], this.status)) {
      clearTimeout(this._doDebounceTimer)
      this._syncCallbacks.push(cb)
      this._currentSync.push({reason, passInOption})
      this._doDebounceTimer = setTimeout(this._fireSync.bind(this), debounceSeconds)
    } else {
      this._syncCallbacks.push(cb)
      this._nextSync.push({reason, passInOption})
    }

    if (this._doSyncRetryInfo && this._doSyncRetryInfo.triedTimes() > 1 && !this._doSyncRetryInfo.isCanceled()) {
      this._doSyncRetryInfo.cancel()
    }
  }

  _callSync(time = 1) {
    const reasons = _map(this._currentSync, 'reason')
    const passInOptions = _map(this._currentSync, 'passInOption')
    const syncInfo = {passInOptions, isFirstTime: this.lastSuccessTime == null}
    const option = _extend(
      {syncAllData: false},
      {syncAllData: _some(passInOptions, 'syncAllData')},
    )

    const tryToStartSecondSync = (catchingError) => {
      return (passInObj) => {
        if (_isEmpty(this._nextSync)) {
          if (catchingError) {
            return Promise.reject(passInObj)
          } else {
            return passInObj
          }
        }

        this._currentSync = this._nextSync
        this._nextSync = []
        return this._callSync(time + 1)
      }
    }

    this.status = 'blocking'
    /**
     * `Thinker#status` 变为 `blocking` 时触发
     *
     * @event Thinker#blocking
     */
    this._changeStatus('blocking')
    return this._waitUntilCanSync(syncInfo).then(() => {
      this.status = 'processing'
      /**
       * `Thinker#status` 变为 `processing` 时触发
       *
       * @event Thinker#processing
       */
      this._changeStatus('processing')
      this.initOption.logger.log(`[Thinker] start(${time}), reasons: \n  - ${reasons.join('\n  - ')}`)
      return this._doSync(syncInfo, option)
    }).then(tryToStartSecondSync(false), tryToStartSecondSync(true))
  }

  _fireSync() {
    const autoSwitchStatus = () => {
      this._statusBackToWaitingTimer = setTimeout(() => {
        this.status = 'waiting'
        /**
         * `Thinker#status` 变为 `waiting` 时触发
         *
         * @event Thinker#waiting
         */
        this._changeStatus('waiting')
      }, 1000 * 2)
    }

    clearTimeout(this._doDebounceTimer)
    this._doDebounceTimer = null
    this._callSync(1).then(() => {
      const syncCallbacks = this._syncCallbacks
      this._syncCallbacks = []
      this.status = 'succeed'
      /**
       * `Thinker#status` 变为 `succeed` 时触发
       *
       * @event Thinker#succeed
       */
      this._changeStatus('succeed')
      this.initOption.logger.log('[Thinker] succeed')
      syncCallbacks.forEach(cb => typeof cb === 'function' && cb())
    }, (err) => {
      const syncCallbacks = this._syncCallbacks
      this._syncCallbacks = []
      this.status = 'failed'
      /**
       * `Thinker#status` 变为 `failed` 时触发
       *
       * @event Thinker#failed
       */
      this._changeStatus('failed', [err])
      this.initOption.logger.log('[Thinker] failed')
      syncCallbacks.forEach(cb => typeof cb === 'function' && cb(err))
    }).then(autoSwitchStatus, autoSwitchStatus)
  }

  _changeStatus(newStatus) {
    this.status = newStatus
    this.trigger(newStatus)
    /**
     * @event Thinker#statusChange
     * @param {string} newStatus
     * @description `Thinker#status` 改变成任何状态时，在以状态名为名的事件触发后再触发
     *
     * ```javascript
     * thinker.on('succeed', () => {
     *   console.log('thinker succeed')
     * })
     * thinker.on('statusChange', (statusName) => {
     *   if (statusName === 'succeed') {
     *     console.log('thinker change status succeed')
     *   }
     * })
     *
     * // output:
     * // thinker succeed
     * // thinker change status succeed
     * ```
     */
    this.trigger('statusChange', [newStatus])
  }

  _waitUntilCanSync(syncInfo) {
    const tryStartSync = () => {
      this.initOption._canStartSyncNowAsync(syncInfo).then((canStartSyncNow) => {
        if (canStartSyncNow === true) {
          defer.resolve()
        } else {
          const reason = _isString(canStartSyncNow) ? canStartSyncNow : 'some reason'
          this.initOption.logger.log(`[Thinker] sync blocked by ${reason}, will try again after ${this.initOption.blockRetryInterval / 1000} seconds`)
          setTimeout(tryStartSync, this.initOption.blockRetryInterval)
        }
      })
    }

    const defer = utils.pending()
    tryStartSync()
    return defer.promise
  }

  _doSync(syncInfo, option) {
    const getDataMethodName = option.syncAllData ? '_getAllDataToSyncAsync' : '_getDataToSyncAsync'
    return this.initOption[getDataMethodName](syncInfo).then((data) => {
      const requestUrl = `${this.initOption.apiPrefix}/account/sync`
      let requestData
      if (syncInfo.isFirstTime) {
        // 如果是第一次同步，那么需要指定只同步最近一个月的数据
        requestData = {fast_from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).toJSON(), objects: {}}
      } else {
        requestData = {last_sync: this.lastSuccessTime.toJSON(), objects: data}
      }
      const requestConfig = {url: requestUrl, method: 'POST', data: requestData, params: null}

      if (this.initOption.autoRetryRequestCount) {
        this._doSyncRetryInfo = utils.delayRetry((retryTime) => {
          this.initOption.logger.log(`[Thinker] request retry(${retryTime})`, requestConfig)
          return this.initOption._sendRequestAsync(syncInfo, _cloneDeep(requestConfig)).then((resp) => {
            resp.config = requestConfig
            return resp
          }, (err) => {
            this.initOption.logger.error(`[Thinker] request failed(${retryTime})`, err)
            return Promise.reject(err)
          })
        }, {maxRetryCount: this.initOption.autoRetryRequestCount})
        return this._doSyncRetryInfo.promise
      } else {
        return this.initOption._sendRequestAsync(syncInfo, _cloneDeep(requestConfig)).then((resp) => {
          resp.config = requestConfig
          return resp
        })
      }
    }).then((resp) => {
      // 有时后端会响应一个空白，这时就代表数据出错或者后端出错了
      if (!resp.data) {
        throw new errors.ResponseEntityEmptyError(resp)
      }
      return this._updateLocalData(syncInfo, resp).then(() => resp)
    }, (resp) => {
      // 服务端写入数据出错/冲突就会返回 507 ，但这种错误客户端是可以自己消化掉的
      // 所以不抛出错误，继续下一步
      if (resp.status !== 507) {
        throw new errors.SyncFailedError(resp)
      }
      return this._updateLocalData(syncInfo, resp).then(() => resp)
    }).then((resp) => {
      const newLastSyncTime = utils.parseValidDate(resp.data.last_sync) == null || new Date
      this.initOption.storage.setItem(CONSTS.LAST_SYNC_STORAGE_KEY, newLastSyncTime.getTime())
      this.initOption.storage.removeItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY)
      return resp
    }).catch((err) => {
      if (this.initOption.storage.getItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY)) {
        this.initOption.storage.setItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY, new Date().getTime())
      }
      return Promise.reject(err)
    }).then((arg) => {
      if (syncInfo.isFirstTime && this.initOption.autoBackgroundCompletelySync) {
        const option = {syncAllData: true}
        const syncInfo = {passInOptions: [option], isFirstTime: false}
        this._doSync(syncInfo, option).then(() => {
          this.initOption.storage.setItem(CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY, 'true')
          this.trigger('backgroundInitializeCompletelySyncSucceed')
        })
      }
      return arg
    })
  }

  _decideAction(serverItem, localItem, requestItem, isServerSaveFailed) {
    const requestItemUpdatedAt = requestItem && requestItem.updated_at ? new Date(requestItem.updated_at).valueOf() : undefined
    const localItemUpdatedAt = localItem && localItem.updated_at ? new Date(localItem.updated_at).valueOf() : undefined
    const serverItemUpdatedAt = serverItem && serverItem.updated_at ? new Date(serverItem.updated_at).valueOf() : undefined

    if (!localItem) {
      return serverItem ? 'new': 'doNothing'
    } else if (!serverItem) {
      if (isServerSaveFailed) {
        return 'doNothing'
      } else if (!requestItem) {
        return 'doNothing'
        // moment(localItem.updated_at).isAfter(requestItem.updated_at)
      } else if (localItemUpdatedAt > requestItemUpdatedAt) {
        return 'doNothing'
      } else if (localItemUpdatedAt === requestItemUpdatedAt) {
        return 'cleanDirty'
      } else {
        return 'doNothing'
      }
      // moment(localItem.updated_at).isAfter(serverItem.updated_at)
    } else if (localItemUpdatedAt > serverItemUpdatedAt) {
      return 'doNothing'
    } else if (localItemUpdatedAt === serverItemUpdatedAt) {
      // 不排除更新时间存在时区信息的情况，所以需要转换成时间戳来对比，这种情况下如果
      // 服务器那边也没有出错，那就说明服务器认为这个应该被更新，那就以服务器为准
      return isServerSaveFailed ? 'doNothing' : 'update'
    } else {
      return 'update'
    }
  }

  _updateLocalData(syncInfo, resp) {
    const requestData = resp.config.data.objects
    const serverData = resp.data.objects

    const itemIds = {}
    _reduce(requestData, pickObjectsIds, itemIds)
    _reduce(serverData, pickObjectsIds, itemIds)
    return this.initOption._getItemsAsync(syncInfo, itemIds).then((localData) => {
      const groupedPromises = _mapValues(localData, (localItems, type) => {
        const serverItems = serverData[type]
        const requestItems = requestData[type]
        if (type === 'todo_order') {
          const serverSaveFailed = _includes(resp.data.failures, "todo_order")
          const action = this._decideAction(serverItems, localItems, requestItems, serverSaveFailed)
          let actionData
          switch (action) {
            case 'doNothing':
              actionData = localItems
              break
            case 'cleanDirty':
              actionData = requestItems
              break
            case 'change':
            case 'new':
              actionData = serverItems
              break
          }
          return {[action]: actionData}
          // 如果 failure 里出现 ObjectType 的话，那就不用检查 resp.data.objects 了
        } else if (_includes(resp.data.failures, type)) {
          let requestItemsMappedLocalItems
          // 所有 requestItem 对应的 localItem 都 keepDirty 就好了
          if (requestItems != null) {
            requestItemsMappedLocalItems = _reduce(localItems, (memo, localItem, id) => {
              if (requestItems[id] != null) {
                memo[id] = localItem
              }
              return memo
            }, {})
          } else {
            requestItemsMappedLocalItems = {}
          }
          return {keepDirty: requestItemsMappedLocalItems}
        } else {
          const deserializingActionPromiseGroups = _reduce(itemIds[type], (memo, itemId) => {
            const serverItem = serverItems != null ? serverItems[itemId] : undefined
            const requestItem = requestItems != null ? requestItems[itemId] : undefined
            const localItem = localItems != null ? localItems[itemId] : undefined
            const serverSaveFailed = _includes(resp.data.failures, `${type}:${itemId}`)
            const action = this._decideAction(serverItem, localItem, requestItem, serverSaveFailed)
            if (!memo[action]) { memo[action] = {} }
            memo[action][itemId] = this.initOption._deserializeItemAsync(syncInfo, type, action, requestItem, localItem, serverItem)
            return memo
          }, {})
          const deserializingActionGroups = _reduce(deserializingActionPromiseGroups, (memo, promises, action) => {
            memo[action] = utils.props(promises)
            return memo
          }, {})
          return utils.props(deserializingActionGroups)
        }
      })
      return utils.props(groupedPromises)
    }).then((groupedData) => {
      _forEach(groupedData, (groupedItems, type) => {
        _forEach(groupedItems, (items, action) => {
          if (_isEmpty(items)) {
            delete groupedItems[action]
          }
        })
      })
      return this.initOption._updateLocalDataAsync(syncInfo, groupedData).then(() => resp)
    })
  }
}

Thinker.defaultOption = defaultOption

definePrototype(Thinker)

_forEach(errors, (Error, errName) => {
  Thinker[errName] = Error
})

module.exports = Thinker
