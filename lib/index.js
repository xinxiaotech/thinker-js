const global = this
let _
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  _ = require('lodash')
} else {
  _ = global._
}

const EventEmitter = require('wolfy87-eventemitter')
const utils = require('./utils')
const definePrototype = require('./define_prototype')
const defaultOption = require('./default_option')
const errors = require('./errors')
const CONSTS = require('./constants')

const pickObjectsIds = (memo, items, type) => {
  if (type === 'todo_order') {
    memo[type] = []
  } else {
    memo[type] = (memo[type] || []).concat(_.keys(items))
  }
  return memo
}

class Thinker extends EventEmitter {
  /**
   * @constructs Thinker
   * @param {Object} passInOption
   * @see {@link Thinker.defaultOption}
   */
  constructor(passInOption) {
    super()

    this.initOption = _.extend({}, Thinker.defaultOption, passInOption)
    this.initOption.apiPrefix = this.initOption.apiPrefix.replace(/\/$/, '')
    'canStartSyncNow sendRequest getDataToSync getAllDataToSync getItems updateLocalData'.split(' ').forEach((methodName) => {
      this.initOption[`_${methodName}Async`] = utils.denodify(this.initOption, methodName)
    })

    this._nextSync = []
    this._currentSync = []
    this._syncCallbacks = []

    this.once('backgroundInitializeCompletelySyncSucceed', () => {
      this.backgroundInitializeCompletelySyncSucceed = true
    })

    // 如果后台完整同步在之前就已经完成了，那么告知调用者也是越早越好
    if (this.initOption.storage.getItem(CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY) === 'true') {
      // @event backgroundInitializeCompletelySyncSucceed
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

    if (_.includes(['waiting', 'succeed', 'failed'], this.status)) {
      this.status = 'preparing'
      // @event 'preparing'
      this.trigger('preparing')
      clearTimeout(this._statusBackToWaitingTimer)
      this._syncCallbacks.push(cb)
      this._currentSync.push({reason, passInOption})
      this._doDebounceTimer = setTimeout(this._fireSync.bind(this), this.initOption.debounceWait)
    } else if (_.includes(['preparing', 'blocking'], this.status)) {
      clearTimeout(this._doDebounceTimer)
      this._syncCallbacks.push(cb)
      this._currentSync.push({reason, passInOption})
      this._doDebounceTimer = setTimeout(this._fireSync.bind(this), this.initOption.debounceWait)
    } else {
      this._syncCallbacks.push(cb)
      this._nextSync.push({reason, passInOption})
    }
  }

  _autoSwitchStatus() {
    this._statusBackToWaitingTimer = setTimeout(() => {
      this.status = 'waiting'
      // @event 'waiting'
      this.trigger('waiting')
    }, 1000 * 2)
  }

  _callSync(time = 1) {
    const reasons = _.map(this._currentSync, 'reason')
    const passInOptions = _.map(this._currentSync, 'passInOption')
    const syncInfo = {passInOptions, isFirstTime: this.lastSuccessTime == null}
    const option = _.extend(
      {syncAllData: false},
      {syncAllData: _.some(passInOptions, 'syncAllData')},
    )

    this.status = 'blocking'
    // @event 'blocking'
    this.trigger('blocking')
    return this._waitUntilCanSync(syncInfo).then(() => {
      this.status = 'processing'
      // @event 'processing'
      this.trigger('processing')
      this.initOption.logger.log(`[Thinker] start(${time}), reasons: \n  - ${reasons.join('\n  - ')}`)
      return this._doSync(syncInfo, option)
    }).then(() => {
      if (_.isEmpty(this._nextSync)) { return }
      this._currentSync = this._nextSync
      this._nextSync = []
      return this._callSync(time + 1)
    })
  }

  _fireSync() {
    this._doDebounceTimer = null
    this._callSync(1).then(() => {
      const syncCallbacks = this._syncCallbacks
      this._syncCallbacks = []
      this.status = 'succeed'
      // @event 'succeed'
      this.trigger('succeed')
      this.initOption.logger.log('[Thinker] succeed')
      syncCallbacks.forEach(cb => typeof cb === 'function' && cb())
    }, (err) => {
      const syncCallbacks = this._syncCallbacks
      this._syncCallbacks = []
      this.status = 'failed'
      // @event 'failed'
      this.trigger('failed')
      this.initOption.logger.log('[Thinker] failed')
      syncCallbacks.forEach(cb => typeof cb === 'function' && cb(err))
    }).then(this._autoSwitchStatus, this._autoSwitchStatus)
  }

  /**
   * 用于确认是否正在一次同步中
   *
   * @function isDoing
   * @memberof Thinker#
   * @return {Boolean}
   */
  isDoing() {
    return _.includes(['preparing', 'blocking', 'processing'])
  }

  _waitUntilCanSync(syncInfo) {
    const tryStartSync = () => {
      this.initOption._canStartSyncNowAsync(syncInfo).then((canStartSyncNow) => {
        if (canStartSyncNow === true) {
          defer.resolve()
        } else {
          const reason = _.isString(canStartSyncNow) ? canStartSyncNow : 'some reason'
          this.initOption.logger.log(`[Thinker] sync blocked by ${reason}, will try again after ${this.initOption.debounceWait / 1000} seconds`)
          setTimeout(tryStartSync, this.initOption.debounceWait)
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
        utils.delayRetry((retryTime) => {
          this.initOption.logger.log(`[Thinker] request retry(${retryTime})`, requestConfig)
          return this.initOption._sendRequestAsync(_.cloneDeep(requestConfig)).then((resp) => {
            resp.config = requestConfig
            resp
          })
        }, {maxRetryCount: this.initOption.autoRetryRequestCount})
      } else {
        this.initOption._sendRequestAsync(_.cloneDeep(requestConfig)).then((resp) => {
          resp.config = requestConfig
          return resp
        })
      }
    }).then((resp) => {
      // 有时后端会响应一个空白，这时就代表数据出错或者后端出错了
      if (!resp.data) {
        throw new errors.ResponseEntityEmptyError(resp)
      }
      return this._updateLocalData(syncInfo, resp)
    }, (resp) => {
      // 服务端写入数据出错/冲突就会返回 507 ，但这种错误客户端是可以自己消化掉的
      // 所以不抛出错误，继续下一步
      if (resp.status !== 507) {
        throw new errors.SyncFailedError(resp)
      }
      return this._updateLocalData(syncInfo, resp)
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
    if (!localItem) {
      return serverItem ? 'new': 'doNothing'
    } else if (!serverItem) {
      if (isServerSaveFailed) {
        return 'doNothing'
      } else if (!requestItem) {
        return 'doNothing'
      } else if (moment(localItem.updated_at).isAfter(requestItem.updated_at)) {
        return 'doNothing'
      } else if (moment(localItem.updated_at).valueOf() === moment(requestItem.updated_at).valueOf()) {
        return 'cleanDirty'
      } else {
        return 'doNothing'
      }
    } else if (moment(localItem.updated_at).isAfter(serverItem.updated_at)) {
      return 'doNothing'
    } else if (moment(localItem.updated_at).valueOf() === moment(serverItem.updated_at).valueOf()) {
      // 不排除更新时间存在时区信息的情况，所以需要 moment 转换成时间戳来对比
      // 这种情况下如果服务器那边也没有出错，那就说明服务器认为这个应该被更新，那就以服务器为准
      return isServerSaveFailed ? 'doNothing' : 'update'
    } else {
      return 'update'
    }
  }

  _updateLocalData(syncInfo, resp) {
    const requestData = resp.config.data.objects
    const serverData = resp.data.objects

    const itemIds = {}
    _.reduce(requestData, pickObjectsIds, itemIds)
    _.reduce(serverData, pickObjectsIds, itemIds)
    this.initOption._getItemsAsync(syncInfo, itemIds).then((localData) => {
      const groupedData = _.mapValues(localData, (localItems, type) => {
        if (type === 'todo_order') {
          const serverSaveFailed = _.includes(resp.data.failures, "todo_order")
          const requestTodoOrder = requestData.todo_order
          const action = this._decideAction(serverItems, localItems, requestTodoOrder, serverSaveFailed)
          let actionData
          switch (action) {
            case 'doNothing':
              actionData = localItems
              break
            case 'cleanDirty':
              actionData = requestTodoOrder
              break
            case 'change':
            case 'new':
              actionData = serverItems
              break
          }
          return {[action]: actionData}
          // 如果 failure 里出现 ObjectType 的话，那就不用检查 resp.data.objects 了
        } else if (_.includes(resp.data.failures, type)) {
          let requestItemsMappedLocalItems
          // 所有 requestItem 对应的 localItem 都 keepDirty 就好了
          if (requestData[type] != null) {
            requestItemsMappedLocalItems = _.filter(localItems, (localItem, id) => requestData[type][id] != null)
          } else {
            requestItemsMappedLocalItems = []
          }
          return {keepDirty: requestItemsMappedLocalItems}
        } else {
          _.group(localItems, (localItem, id) => {
            const serverItem = serverItems[id]
            const requestItem = requestData[type] != null ? requestData[type][itemId] : undefined
            const serverSaveFailed = _.includes(resp.data.failures, `${type}:${itemId}`)
            return this._decideAction(serverItem, localItem, requestItem, serverSaveFailed)
          })
        }
      })
      _.forEach(groupedData, (groupedItems, type) => {
        _.forEach(groupedItems, (items, action) => {
          if (_.isEmpty(items)) {
            delete groupedItems[action]
          }
        })
      })
      this.initOption._updateLocalDataAsync(syncInfo, groupedData).then(() => resp)
    })
  }
}

Thinker.defaultOption = defaultOption

definePrototype(Thinker)

_.forEach(errors, (Error, errName) => {
  Thinker[errName] = Error
})

module.exports = Thinker