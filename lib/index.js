import EventEmitter from 'wolfy87-eventemitter'
import utils from './utils'
import definePrototype from './define_prototype'
import defaultOption from './default_option'
import * as errors from './errors'
import * as CONSTS from './constants'

import _uniq from 'lodash-es/uniq'
import _keys from 'lodash-es/keys'
import _values from 'lodash-es/values'
import _includes from 'lodash-es/includes'
import _forEach from 'lodash-es/forEach'
import _map from 'lodash-es/map'
import _isEmpty from 'lodash-es/isEmpty'
import _some from 'lodash-es/some'
import _reduce from 'lodash-es/reduce'
import _mapValues from 'lodash-es/mapValues'
import _isString from 'lodash-es/isString'
import _cloneDeep from 'lodash-es/cloneDeep'
import _compact from 'lodash-es/compact'

const pickObjectsIds = (memo, items, type) => {
  if (type === 'todo_order') {
    memo[type] = []
  } else {
    memo[type] = _uniq((memo[type] || []).concat(_keys(items)))
  }
  return memo
}

const mergeSyncOptions = options => {
  if (!Array.isArray(options)) return options

  const timeoutArray = _compact(_map(options, 'timeout'))
  const timeout = timeoutArray.length ? Math.min.apply(Math, timeoutArray) : undefined

  const syncAllDataArray = _compact(_map(options, 'syncAllData'))
  const syncAllData = _some(syncAllDataArray)

  return {
    ...Object.assign.apply(Object, [{}].concat(options)),
    timeout,
    syncAllData,
  }
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

    this.initOption = {
      ...Thinker.defaultOption,
      ...passInOption,
    }
    this.initOption.apiPrefix = this.initOption.apiPrefix.replace(/\/$/, '')

    this._nextSync = []
    this._currentSync = []
    this._syncCallbacks = []
    this._doDebounceTimer = null
    this._autoSwitchStatusTimer = null
    this._doSyncRetryInfo = null

    // 如果后台完整同步在之前就已经完成了，那么告知调用者也是越早越好
    if (this.backgroundInitializeCompletelySyncSucceed) {
      /**
       * 在后台初次完整同步后触发
       *
       * @event Thinker#backgroundInitializeCompletelySyncSucceed
       */
      this.trigger('backgroundInitializeCompletelySyncSucceed')
    }
  }

  /**
   * 清理在本地存储的状态
   *
   * @param {?String} type - 要清理的的状态名称，目前支持的有 `lastSuccessTime`, `lastFailTime`, `backgroundInitializeCompletelySyncSucceed` ，如果不传，则清理所有状态
   *
   * @function cleanStoragedStatus
   * @memberof Thinker#
   */
  cleanStoragedStatus(type) {
    const typeKeyMap = {
      lastSuccessTime: CONSTS.LAST_SYNC_STORAGE_KEY,
      lastFailTime: CONSTS.LAST_SYNC_FAIL_STORAGE_KEY,
      backgroundInitializeCompletelySyncSucceed: CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY,
    }

    if (type == null) {
      _values(typeKeyMap).forEach(
        this.initOption.storage.removeItem.bind(this.initOption.storage)
      )
    } else if (typeKeyMap[type] != null) {
      this.initOption.storage.removeItem(typeKeyMap[type])
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
    /**
     * 函数的调用链：
     * do
     *     _changeStatus
     *     _intoSync
     *         _changeStatus
     *         _callSync
     *             _changeStatus
     *             _waitUntilCanSync
     *             _doSync
     *                 options.getDataToSync
     *                 _sendSyncRequest
     *                     options.sendRequest
     *                 _updateLocalData
     *                     options.getItems
     *                     _deserializeItem
     *                         _decideAction
     *                     options.updateLocalData
     *         cb
     */

    if (!reason) {
      throw new Error('[Thinker] reason is required')
    }

    let debounceSeconds = this.initOption.debounce
    if (passInOption && passInOption.debounce != null) {
      debounceSeconds = passInOption.debounce
    }

    const callIntoSync = () => {
      clearTimeout(this._doDebounceTimer)
      this._doDebounceTimer = null
      this._intoSync()
    }

    const nextToPreparingStatus = [undefined, 'waiting', 'succeed', 'failed']
    const updateDebounceTimerStatus = ['preparing', 'blocking']
    if (_includes(nextToPreparingStatus.concat(updateDebounceTimerStatus), this.status)) {
      if (_includes(nextToPreparingStatus, this.status)) {
        this._changeStatus('preparing')
        clearTimeout(this._autoSwitchStatusTimer)
        this._autoSwitchStatusTimer = null
      } else {
        clearTimeout(this._doDebounceTimer)
      }
      this._syncCallbacks.push(cb)
      this._currentSync.push({reason, passInOption})
      this._doDebounceTimer = setTimeout(callIntoSync, debounceSeconds)
    } else {
      this._syncCallbacks.push(cb)
      this._nextSync.push({reason, passInOption})
    }

    if (
      this._doSyncRetryInfo &&
      this._doSyncRetryInfo.triedTimes() > 1 &&
      !this._doSyncRetryInfo.isCanceled()
    ) {
      this._doSyncRetryInfo.cancel()
    }
  }

  _intoSync() {
    this._callSync().then(() => {
      const syncCallbacks = this._syncCallbacks
      this._syncCallbacks = []
      this._changeStatus('succeed')
      this.initOption.logger.log('[Thinker] succeed')
      syncCallbacks.forEach(cb => typeof cb === 'function' && cb())
      const timer = setTimeout(() => {
        if (this._autoSwitchStatusTimer === timer) {
          this._autoSwitchStatusTimer = null
          this._changeStatus('waiting')
        }
      }, 1000 * 2)
      this._autoSwitchStatusTimer = timer
    }, err => {
      const syncCallbacks = this._syncCallbacks
      this._syncCallbacks = []
      this._changeStatus('failed', [err])
      this.initOption.logger.log('[Thinker] failed')
      syncCallbacks.forEach(cb => typeof cb === 'function' && cb(err))
      const timer = setTimeout(() => {
        if (this._autoSwitchStatusTimer === timer) {
          this._autoSwitchStatusTimer = null
        }
      }, 1000 * 2)
      this._autoSwitchStatusTimer = timer
      return Promise.reject(err)
    })
  }

  _callSync(time = 1) {
    const reasons = _map(this._currentSync, 'reason')
    const passInOptions = _map(this._currentSync, 'passInOption')
    const syncInfo = { passInOptions, isFirstTime: this.lastSuccessTime == null }
    const option = mergeSyncOptions(passInOptions)

    const tryToStartSecondSync = catchingError => passInObj =>
      this._tryToStartSecondSync(catchingError, time, passInObj)

    this._changeStatus('blocking')
    return this._waitUntilCanSync(syncInfo, this.initOption).then(() => {
      this._changeStatus('processing')
      this.initOption.logger.log(`[Thinker] start(${time}), reasons: \n  - ${reasons.join('\n  - ')}`)
      return this._doSync(syncInfo, option)
    }).then(
      tryToStartSecondSync(false),
      tryToStartSecondSync(true),
    )
  }

  _tryToStartSecondSync(catchingError, syncCalledTime, passInObj) {
    if (_isEmpty(this._nextSync)) {
      this._currentSync = []
      if (catchingError) {
        return Promise.reject(passInObj)
      } else {
        return passInObj
      }
    }

    this._currentSync = this._nextSync
    this._nextSync = []
    return this._callSync(syncCalledTime + 1)
  }

  _waitUntilCanSync(syncInfo, initOption) {
    const tryStartSync = () => {
      initOption.call('canStartSyncNow', syncInfo).then(canStartSyncNow => {
        if (canStartSyncNow === true) {
          defer.resolve()
        } else {
          const reason = _isString(canStartSyncNow) ? canStartSyncNow : 'some reason'
          initOption.logger.log(`[Thinker] sync blocked by ${reason}, will try again after ${initOption.blockRetryInterval / 1000} seconds`)
          setTimeout(tryStartSync, initOption.blockRetryInterval)
        }
      }).catch(defer.reject)
    }

    const defer = utils.pending()
    tryStartSync(syncInfo, initOption)
    return defer.promise
  }

  /**
   * `Thinker#status` 变为 `waiting` 时触发
   *
   * @event Thinker#waiting
   */
  /**
   * `Thinker#status` 变为 `preparing` 时触发
   *
   * @event Thinker#preparing
   */
  /**
   * `Thinker#status` 变为 `blocking` 时触发
   *
   * @event Thinker#blocking
   */
  /**
   * `Thinker#status` 变为 `processing` 时触发
   *
   * @event Thinker#processing
   */
  /**
   * `Thinker#status` 变为 `succeed` 时触发
   *
   * @event Thinker#succeed
   */
  /**
   * `Thinker#status` 变为 `failed` 时触发
   *
   * @event Thinker#failed
   */
  _changeStatus(newStatus, extraArgs) {
    this.status = newStatus
    this.trigger(newStatus, extraArgs)
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
    this.trigger('statusChange', [newStatus].concat(extraArgs))
  }

  _doSync(syncInfo, option) {
    const defer = utils.pending()
    const getDataMethodName = option.syncAllData ? 'getAllDataToSync' : 'getDataToSync'

    let timeout, isTimeout = false
    if (option.timeout != null) {
      timeout = option.timeout
    } else if (!option.syncAllData && this.initOption.timeout != null) {
      timeout = this.initOption.timeout
    } else if (option.syncAllData && this.initOption.syncAllDataTimeout != null) {
      timeout = this.initOption.syncAllDataTimeout
    }
    if (timeout != null) {
      setTimeout(() => {
        isTimeout = true
        defer.reject(new errors.TimeoutError)
      }, timeout)
    }

    this.initOption.call(getDataMethodName, syncInfo).then(data => {
      if (isTimeout) return
      return this._sendSyncRequest(syncInfo, option, data)
    }).then(resp => {
      if (isTimeout) return
      return this._updateLocalData(syncInfo, resp)
    }).then(resp => {
      if (isTimeout) return
      const newLastSyncTime = utils.parseValidDate(resp.data.last_sync) || new Date
      this.initOption.storage.setItem(CONSTS.LAST_SYNC_STORAGE_KEY, newLastSyncTime.getTime())
      this.initOption.storage.removeItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY)
      return resp
    }, err => {
      if (isTimeout) return
      this.initOption.storage.setItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY, new Date().getTime())
      return Promise.reject(err)
    }).then(resp => {
      if (isTimeout) return
      this._tryToTriggerBackgroundInitializeCompletelySync(syncInfo, option)
    }).then(resp => {
      if (isTimeout) return
      defer.resolve(resp)
    }, err => {
      if (isTimeout) return
      defer.reject(err)
    })

    return defer.promise
  }

  _tryToTriggerBackgroundInitializeCompletelySync(syncInfo, passInOption) {
    if (
      !this.backgroundSyncing &&
      !this.backgroundInitializeCompletelySyncSucceed &&
      !syncInfo.background &&
      this.initOption.autoBackgroundCompletelySync
    ) {
      const option = {syncAllData: true}
      const completelySyncInfo = {
        passInOptions: syncInfo.passInOptions.concat(option),
        isFirstTime: false,
        background: true,
      }
      this.backgroundSyncing = true
      this._doSync(completelySyncInfo, option).then(() => {
        this.backgroundSyncing = false
        this.initOption.storage.setItem(CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY, 'true')
        this.trigger('backgroundInitializeCompletelySyncSucceed')
      }, err => {
        this.backgroundSyncing = false
        // 吞掉，等下次同步时直接再做一次就好了
      })
    }
  }

  _sendSyncRequest(syncInfo, option, data) {
    const requestUrl = `${this.initOption.apiPrefix}/account/sync`
    let requestData, requestPromise
    if (option.syncAllData) {
      requestData = {objects: data}
    } else {
      if (!this.lastSuccessTime) {
        // 如果是第一次同步，那么需要指定只同步最近一个月的数据
        requestData = {fast_from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).toJSON(), objects: {}}
      } else {
        requestData = {last_sync: this.lastSuccessTime.toJSON(), objects: data}
      }
    }
    const requestConfig = {url: requestUrl, method: 'POST', data: requestData, params: null}
    const tryRequest = retryTime => {
      this.initOption.logger.log(`[Thinker] request retry(${retryTime})`, requestConfig)
      return this.initOption.call('sendRequest', syncInfo, _cloneDeep(requestConfig)).then(resp => {
        resp.config = requestConfig
        return resp
      }, err => {
        this.initOption.logger.error(`[Thinker] request failed(${retryTime})`, err)
        return Promise.reject(err)
      })
    }

    if (this.initOption.autoRetryRequestCount) {
      this._doSyncRetryInfo = utils.delayRetry(tryRequest, {maxRetryCount: this.initOption.autoRetryRequestCount})
      requestPromise = this._doSyncRetryInfo.promise
    } else {
      requestPromise = tryRequest(1)
    }

    return requestPromise.then(resp => {
      // 服务端写入数据出错/冲突就会返回 507 ，但这种错误客户端是可以自己消化掉的
      // 所以不抛出错误，继续下一步
      if ((resp.status >= 300 || resp.status < 200) && resp.status !== 507) {
        throw new errors.SyncFailedError(resp)
      }
      // 有时后端会响应一个空白，这时就代表数据出错或者后端出错了
      if (!resp.data) {
        throw new errors.ResponseEntityEmptyError(resp)
      }
      return resp
    })
  }

  _updateLocalData(syncInfo, resp) {
    const requestData = resp.config.data.objects
    const serverData = resp.data.objects

    const itemIds = {}
    _reduce(requestData, pickObjectsIds, itemIds)
    _reduce(serverData, pickObjectsIds, itemIds)
    return this.initOption.call('getItems', syncInfo, itemIds).then(localData =>
      utils.props(_mapValues(itemIds, (ids, type) => {
        const requestItems = requestData[type]
        const localItems = localData[type]
        const serverItems = serverData[type]
        return this._deserializeItem(syncInfo, type, ids, requestItems, localItems, serverItems, resp)
      }))
    ).then(groupedData => {
      _forEach(groupedData, (groupedItems, type) => {
        if (_isEmpty(groupedItems)) {
          delete groupedData[type]
        } else {
          _forEach(groupedItems, (items, action) => {
            if (_isEmpty(items)) delete groupedItems[action]
          })
        }
      })
      return this.initOption.call('updateLocalData', syncInfo, groupedData)
    }).then(() => resp)
  }

  _decideAction(requestItem, localItem, serverItem, isServerSaveFailed) {
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

  _deserializeItem(syncInfo, type, itemIds, requestItems, localItems, serverItems, resp) {
    // 如果 failure 里出现 ObjectType 的话，那就不用检查 resp.data.objects 了
    if (type !== 'todo_order' && _includes(resp.data.failures, type)) {
      let requestItemsMappedLocalItems
      if (requestItems != null) {
        requestItemsMappedLocalItems = _reduce(requestItems, (memo, requestItem, id) => {
          memo[id] = localItems[id] || requestItem
          return memo
        }, {})
      }
      return Promise.resolve({ keepDirty: requestItemsMappedLocalItems || {} })
    }

    if (type === 'todo_order') {

      const serverSaveFailed = _includes(resp.data.failures, "todo_order")
      const action = this._decideAction(requestItems, localItems, serverItems, serverSaveFailed)
      return this.initOption.call(
        'deserializeItem',
        syncInfo,
        type,
        action,
        requestItems,
        localItems,
        serverItems,
      ).then(item => ({[action]: item}))

    } else {

      const promiseGroups = _reduce(itemIds, (memo, itemId) => {
        const requestItem = requestItems != null ? requestItems[itemId] : undefined
        const localItem = localItems != null ? localItems[itemId] : undefined
        const serverItem = serverItems != null ? serverItems[itemId] : undefined
        const serverSaveFailed = _includes(resp.data.failures, `${type}:${itemId}`)
        const action = this._decideAction(requestItem, localItem, serverItem, serverSaveFailed)
        if (!memo[action]) memo[action] = {}
        memo[action][itemId] = this.initOption.call(
          'deserializeItem',
          syncInfo,
          type,
          action,
          requestItem,
          localItem,
          serverItem,
        )
        return memo
      }, {})

      return utils.props(_reduce(promiseGroups, (memo, promises, action) => {
        memo[action] = utils.props(promises)
        return memo
      }, {}))

    }
  }
}

Thinker.defaultOption = defaultOption
Thinker.mergeSyncOptions = mergeSyncOptions

definePrototype(Thinker)

_forEach(errors, (Error, errName) => {
  Thinker[errName] = Error
})

export default Thinker
