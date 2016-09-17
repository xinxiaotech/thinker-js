
if process.env.NODE_ENV is 'development' or process.env.NODE_ENV is 'test'
  _ = require 'lodash'
EventEmitter = require 'wolfy87-eventemitter'
Logger = require './logger'
promiseUtils = require './promise_utils'
errors = require './errors'

CONSTS = {
  INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY: 'ds_localdb_init_completely_synced'
  LAST_SYNC_STORAGE_KEY: 'ds_localdb_last_sync'
  LAST_SYNC_FAIL_STORAGE_KEY: 'app_last_sync_failed_time'
}

parseValidDate = (obj) ->
  date = if Object::toString.call(obj) is '[object Date]' then obj else new Date(obj)
  if isNaN(date.getTime()) then null else date

module.exports = class Thinker extends EventEmitter
  ###*
  # 默认的初始化设置项
  #
  # @property {String} [apiPrefix=https://api-ng.pomotodo.com] - 发起同步时要请求的服务器地址
  # @property {Number} [debounceWait=5000] - 在多久时间内多次调用 `do()` 会合并为一次同步请求，单位：秒
  # @property {ThinkerLogger} logger - 日志收集器
  # @property {Storage} storage - 本地存储
  # @property {Boolean} [autoBackgroundCompletelySync=true] - 是否自动发起后台初次完整同步
  # @property {Number} [autoRetryRequestCount=5] - 发起同步请求失败后重试几次
  #
  # @property {Function} canStartSyncNow
  # @property {Function} sendRequest
  # @property {Function} getDataToSync
  # @property {Function} getAllDataToSync
  # @property {Function} getItems
  # @property {Function} updateLocalData
  #
  # @namespace
  # @memberof Thinker
  ###
  @defaultOptions:
    apiPrefix: 'https://api-ng.pomotodo.com'
    debounceWait: 1000 * 5
    logger: new Logger
    storage: localStorage
    autoBackgroundCompletelySync: true
    autoRetryRequestCount: 5

    ###*
    # 从客户端了解是否可以立即开始同步
    #
    # @param {ThinkerType~SyncInfo} syncInfo
    # @param {ThinkerType~NodeLikeCallback} callback - `Function(Error, Boolean)`
    #
    # @alias Thinker.defaultOptions.canStartSyncNow
    # @memberof Thinker
    ###
    canStartSyncNow: (syncInfo, callback) ->
      callback(null, true)

    ###*
    # 让客户端发起 HTTP 请求，并按照格式返回
    #
    # @param {ThinkerType~SyncInfo} syncInfo
    # @param {ThinkerType~RequestInfo} requestInfo
    # @param {ThinkerType~NodeLikeCallback} callback - `Function(Error, {@link ThinkerType~ResponseInfo})`
    #
    # @alias Thinker.defaultOptions.sendRequest
    # @memberof Thinker
    ###
    sendRequest: (syncInfo, requestInfo, callback) ->
      callback(null, config: requestInfo, status: 200, headers: {}, data: {})

    ###*
    # 从客户端获取普通同步需要的数据
    #
    # @param {ThinkerType~SyncInfo} syncInfo
    # @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
    #
    # @alias Thinker.defaultOptions.getDataToSync
    # @memberof Thinker
    ###
    getDataToSync: (syncInfo, callback) ->
      callback(null)

    ###*
    # 从客户端获取完整同步需要的数据
    #
    # @param {ThinkerType~SyncInfo} syncInfo
    # @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
    #
    # @alias Thinker.defaultOptions.getAllDataToSync
    # @memberof Thinker
    ###
    getAllDataToSync: (syncInfo, callback) ->
      callback(null)

    ###*
    # 从客户端获取指定类型的指定条目
    #
    # @param {ThinkerType~SyncInfo} syncInfo
    # @param {ThinkerType~ObjectIdSet} ids
    # @param {ThinkerType~NodeLikeCallback} callback - `Function(Error, {@link ThinkerType~ObjectSet})`
    #
    # @alias Thinker.defaultOptions.getItems
    # @memberof Thinker
    ###
    getItems: (syncInfo, ids, callback) ->
      callback(null, [])

    ###*
    # 要求客户端根据处理过的服务器返回值更新本地数据库
    #
    # @param {ThinkerType~SyncInfo} syncInfo
    # @param {ThinkerType~GroupedObjectSet} data
    # @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
    #
    # @alias Thinker.defaultOptions.updateLocalData
    # @memberof Thinker
    ###
    updateLocalData: (syncInfo, data, callback) ->
      callback(null)

  ###*
  # 当前同步状态
  #
  # `status` 属性的值各自代表的阶段如下：
  #   * `waiting`: 等待触发同步
  #   * `preparing`: 同步已经在计划中，但还没开始，此时调用 `do()` 都会在同步正式开始是合并为一次请求
  #   * `processing`: 同步已经开始，此时调用 `do()` 会自动计划下一次同步
  #   * `succeed` | `failed`: 同步完成或者失败
  #
  # @type {String}
  # @alias status
  # @memberof Thinker#
  ###
  status: 'waiting'

  ###*
  # 是否已经完成了后台初次完整同步
  #
  # @type {Boolean}
  # @alias backgroundInitializeCompletelySyncSucceed
  # @memberof Thinker#
  ###
  backgroundInitializeCompletelySyncSucceed: false

  Object.defineProperties(@prototype,
    ###*
    # 最后一次同步成功的时间
    #
    # @type {Date}
    # @alias lastSuccessTime
    # @memberof Thinker#
    ###
    lastSuccessTime:
      get: ->
        parseValidDate localStorage.getItem CONSTS.LAST_SYNC_STORAGE_KEY

    ###*
    # 最后一次同步失败的时间
    #
    # @type {Date}
    # @alias lastSuccessTime
    # @memberof Thinker#
    ###
    lastFailTime:
      get: ->
        parseValidDate localStorage.getItem CONSTS.LAST_SYNC_FAIL_STORAGE_KEY
  )

  ###*
  # @constructs Thinker
  # @param {Object} passInOption
  # @see {@link Thinker.defaultOptions}
  ###
  constructor: (passInOption) ->
    @initOptions = _.legacyExtend {}, Thinker.defaultOptions, passInOption
    @initOptions.apiPrefix = @initOptions.apiPrefix.replace(/\/$/, '')
    'canStartSyncNow sendRequest getDataToSync getAllDataToSync getItems updateLocalData'.split(' ').forEach (methodName) =>
      @initOptions[methodName] = promiseUtils.denodify @initOptions, methodName

    @_nextSync = []
    @_currentSync = []
    @_syncCallbacks = []

    @once 'backgroundInitializeCompletelySyncSucceed', =>
      @backgroundInitializeCompletelySyncSucceed = true

    # 如果后台完整同步在之前就已经完成了，那么告知调用者也是越早越好
    if localStorage.getItem(CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY) is 'true'
      # @event backgroundInitializeCompletelySyncSucceed
      @trigger 'backgroundInitializeCompletelySyncSucceed'

    return

  _doDebounceTimer: null
  _statusBackToWaitingTimer: null
  ###*
  # 发起同步，可以在任何时候调用，函数自己会确保同时只有一次同步正在工作，并且自动计划下一次同步
  #
  # @param {String}  reason - 触发同步的原因，会打印在日志中
  # @param {ThinkerType~SyncOption}  passInOption - 同步相关设置，调用者也可以传入额外的内容以便在初始化 Thinker 时传入的所有回调函数中使用
  # @param {ThinkerType~NodeLikeCallback} callback
  #
  # @function do
  # @memberof Thinker#
  ###
  do: (reason, passInOption, cb) ->
    throw new Error '[Thinker] reason is required' unless reason

    callSync = (time = 1) =>
      @_currentSync = []

      reasons = _.map @_currentSync, 'reason'
      passInOptions = _.map @_currentSync, 'passInOption'
      syncInfo = {passInOptions, isFirstTime: not @lastSuccessTime?}
      options = _.legacyExtend(
        {syncAllData: false}
        {syncAllData: _.some passInOptions, 'syncAllData'}
      )

      @initOptions.logger.log "[Thinker] start(#{time}), reasons: \n  - #{reasons.join('\n  - ')}"
      @_waitUntilCanSync(options).then =>
        @_doSync(syncInfo, options)
      .then =>
        return if _.isEmpty(@_nextSync)
        @_currentSync = @_nextSync
        @_nextSync = []
        callSync(time + 1)

    fireSync = =>
      @_doDebounceTimer = null
      @status = 'processing'
      # @event 'processing'
      @trigger 'processing'
      callSync(1).then(
        =>
          syncCallbacks = @_syncCallbacks
          @_syncCallbacks = []
          @status = 'succeed'
          # @event 'succeed'
          @trigger 'succeed'
          @initOptions.logger.log '[Thinker] succeed'
          syncCallbacks.forEach (cb) -> cb?()
        (err) =>
          syncCallbacks = @_syncCallbacks
          @_syncCallbacks = []
          @status = 'failed'
          # @event 'failed'
          @trigger 'failed'
          @initOptions.logger.log '[Thinker] failed'
          syncCallbacks.forEach (cb) -> cb?(err)
      ).finally =>
        @_statusBackToWaitingTimer = setTimeout =>
          @status = 'waiting'
          # @event 'waiting'
          @trigger 'waiting'
        , 1000 * 2

    if @status in ['waiting', 'succeed', 'failed']
      @status = 'preparing'
      # @event 'preparing'
      @trigger 'preparing'
      clearTimeout @_statusBackToWaitingTimer
      @_syncCallbacks.push cb
      @_currentSync.push {reason, passInOption}
      @_doDebounceTimer = setTimeout(fireSync, @initOptions.debounceWait)
    else if @status is 'preparing'
      clearTimeout @_doDebounceTimer
      @_syncCallbacks.push cb
      @_currentSync.push {reason, passInOption}
      @_doDebounceTimer = setTimeout(fireSync, @initOptions.debounceWait)
    else
      @_syncCallbacks.push cb
      @_nextSync.push {reason, passInOption}
    return

  ###*
  # 用于确认是否正在一次同步中
  #
  # @function isDoing
  # @memberof Thinker#
  # @return {Boolean}
  ###
  isDoing: ->
    @status in ['preparing', 'processing']

  _waitUntilCanSync: (options) ->
    tryStartSync = =>
      @initOptions.canStartSyncNow().then (canStartSyncNow) =>
        if canStartSyncNow
          defer.resolve()
        else
          reason = if _.isString(canStartSyncNow) then canStartSyncNow else 'some reason'
          @initOptions.logger.log "[Thinker] sync blocked by #{reason}, will try again after #{options.delay / 1000} seconds"
          setTimeout(tryStartSync, options.delay)

    defer = promiseUtils.pending()
    tryStartSync()
    defer.promise

  _doSync: (syncInfo, options) ->
    getDataMethodName = if options.syncAllData then 'getAllData' else 'getData'
    promise = Promise.all([
      @initOptions.getRequestHeaders(syncInfo)
      @initOptions[getDataMethodName](syncInfo)
    ]).then ([requestHeaders, data]) =>
      requestUrl = "#{@initOptions.apiPrefix}/account/sync"
      requestData = if syncInfo.isFirstTime
        last_sync: @lastSuccessTime.toJSON(), objects: data
      else
        # 如果是第一次同步，那么需要指定只同步最近一个月的数据
        fast_from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).toJSON(), objects: {}
      requestConfig = url: requestUrl, method: 'POST', headers: requestHeaders, data: requestData, params: null

      if @initOptions.autoRetryRequestCount
        promiseUtils.delayRetry (retryTime) =>
          @initOptions.logger.log "[Thinker] request retry(#{time})", requestConfig
          @initOptions.sendRequest(_.cloneDeep requestConfig).then (resp) ->
            resp.config = requestConfig
            resp
        , maxRetryCount: @initOptions.autoRetryRequestCount
      else
        @initOptions.sendRequest(_.cloneDeep requestConfig).then (resp) ->
          resp.config = requestConfig
          resp
    .then(
      (resp) =>
        # 有时后端会响应一个空白，这时就代表数据出错或者后端出错了
        throw new errors.ResponseEntityEmptyError(resp) unless resp.data
        @_updateLocalData(syncInfo, resp)
      (resp) =>
        # 服务端写入数据出错/冲突就会返回 507 ，但这种错误客户端是可以自己消化掉的
        # 所以不抛出错误，继续下一步
        throw new errors.SyncFailedError(resp) if resp.status isnt 507
        @_updateLocalData(syncInfo, resp)
    )
    .then (resp) ->
      newLastSyncTime = parseValidDate(resp.data.last_sync) ? new Date
      localStorage.setItem CONSTS.LAST_SYNC_STORAGE_KEY, newLastSyncTime.getTime()
      localStorage.removeItem CONSTS.LAST_SYNC_FAIL_STORAGE_KEY
      resp
    .catch (err) ->
      if localStorage.getItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY)
        localStorage.setItem CONSTS.LAST_SYNC_FAIL_STORAGE_KEY, new Date().getTime()
      Promise.reject(err)
    .then (arg) =>
      if syncInfo.isFirstTime and @initOptions.autoBackgroundCompletelySync
        options = syncAllData: true
        syncInfo = passInOptions: [option], isFirstTime: false
        @_doSync(syncInfo, options).then =>
          localStorage.setItem CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY, 'true'
          @trigger 'backgroundInitializeCompletelySyncSucceed'
          return
      arg
    promise._cancelFns = []
    promise

  _decideAction: (serverItem, localItem, requestItem, isServerSaveFailed) ->
    if isServerSaveFailed
      if not localItem
        'new'
      else if not serverItem
        'keepDirty'
      # 当 failures 里存在这个条目时，说明后端保存数据出了一些问题，后端数据的 updated_at 时间
      # 是有可能早于本地数据的更新时间的
      else if moment(serverItem.updated_at).isBefore(localItem.updated_at)
        'keepDirty'
      else
        'update'
    else
      if not localItem
        'new'
      else if not serverItem
        'cleanDirty'
      else if moment(localItem.updated_at).isAfter(serverItem.updated_at)
        'keepDirty'
      else if localItem.updated_at is requestItem.updated_at
        'cleanDirty'
      else
        'update'

  _updateLocalData: (syncInfo, resp) ->
    requestData = resp.config.data.objects
    serverData = resp.data.objects

    itemIds = {}
    _.reduce requestData, @_pickObjectsIds, itemIds
    _.reduce serverData, @_pickObjectsIds, itemIds
    @initOptions.getItems(syncInfo, itemIds).then (localData) =>
      groupedData = _.mapValues localData, (localItems, type) =>
        if type is 'todo_order'
          serverSaveFailed = _.includes(resp.data.failures, "todo_order")
          requestTodoOrder = requestData.todo_order
          action = @_decideAction(serverItems, localItems, requestTodoOrder, serverSaveFailed)
          actionData = switch action
            when 'keepDirty' then localItems
            when 'cleanDirty' then requestTodoOrder
            when 'change', 'new' then serverItems
          {"#{action}": actionData}
        # 如果 failure 里出现 ObjectType 的话，那就不用检查 resp.data.objects 了
        # 所有 requestItem 对应的 localItem 都 keepDirty 就好了
        else if _.includes(resp.data.failures, type)
          if requestData[type]?
            requestItemsMappedLocalItems = _.filter localItems, (localItem, id) => requestData[type][id]?
          else
            requestItemsMappedLocalItems = []
          keepDirty: requestItemsMappedLocalItems
        else
          _.group localItems, (localItem, id) =>
            serverItem = serverItems[id]
            requestItem = requestData[type]?[itemId]
            serverSaveFailed = _.includes(resp.data.failures, "#{type}:#{itemId}")
            @_decideAction(serverItem, localItem, requestItem, serverSaveFailed)
      _.forEach groupedData, (groupedItems, type) ->
        _.forEach groupedItems, (items, action) ->
          if _.isEmpty(items)
            delete groupedItems[action]
      @initOptions.updateLocalData(syncInfo, groupedData).then(-> resp)

  _pickObjectsIds: (memo, items, type) ->
    if type is 'todo_order'
      memo[type] = []
    else
      memo[type] = (memo[type] or []).concat(_.keys items)
    memo

_.forEach errors, (Error, errName) ->
  Thinker[errName] = Error
