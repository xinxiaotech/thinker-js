const Logger = require('./logger')
let root
try {
  root = window || global || {}
} catch (err) {
  root = {}
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
  logger: new Logger,
  storage: root.localStorage,
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
  canStartSyncNow(syncInfo, callback) {
    callback(null, true)
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
  sendRequest(syncInfo, requestInfo, callback) {
    callback(null, {config: requestInfo, status: 200, headers: {}, data: {}})
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
  getDataToSync(syncInfo, callback) {
    callback(null)
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
  getAllDataToSync(syncInfo, callback) {
    callback(null)
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
  getItems(syncInfo, ids, callback) {
    callback(null, [])
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
  updateLocalData(syncInfo, data, callback) {
    callback(null)
  },

  /**
   * 要求客户端根据处理过的服务器返回值更新本地数据库
   *
   * @param {ThinkerType~SyncInfo} syncInfo
   * @param {ThinkerType~ObjectType} objectType
   * @param {ThinkerType~ObjectAction} objectAction
   * @param {Object} localObject
   * @param {Object} serverObject
   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
   *
   * @alias Thinker.defaultOption.deserializeItem
   * @memberof Thinker
   */
  deserializeItem(syncInfo, objectType, objectAction, localObject, serverObject, callback) {
    callback(null, serverObject)
  },
}
