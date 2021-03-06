import MemoryLogger from './memory_logger'
import MemoryStorage from './memory_storage'
import utils from './utils'

let root
try {
  root = window || global || {}
} catch (err) {
  root = {}
}

/* istanbul ignore next */
const optionCallbacks = {
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
   * 客户端可以在这个函数里对数据进行预处理，被处理过的值会被传入 {@link Thinker.defaultOption.updateLocalData}
   *
   * @param {ThinkerType~SyncInfo} syncInfo
   * @param {ThinkerType~ObjectType} objectType
   * @param {ThinkerType~ObjectAction} objectAction
   * @param {?Object} requestItem
   * @param {?Object} localItem
   * @param {?Object} serverItem
   * @param {ThinkerType~NodeLikeCallback} callback - `Function(Error)`
   *
   * @alias Thinker.defaultOption.deserializeItem
   * @memberof Thinker
   */
  deserializeItem(
    syncInfo,
    objectType,
    objectAction,
    requestItem,
    localItem,
    serverItem,
    callback,
  ) {
    let finalItem
    switch (objectAction) {
      case 'change':
      case 'new':
        finalItem = serverItem
        break
      default:
        finalItem = localItem || requestItem
        break
    }
    callback(null, finalItem)
  },

  call(cbName, ...args) {
    return utils.denodify(this, cbName)(...args)
  },
}

/**
 * 默认的初始化设置项
 *
 * @property {String} [apiPrefix=https://api-ng.pomotodo.com] - 发起同步时要请求的服务器地址
 * @property {?Number} [timeout=undefined] - 同步的超时时间，从 `Thinker#status` 变成 `processing` 开始计时，如果超时了，`Thinker#do` 的回调函数的第一个参数会是 {@link Thinker.TimeoutError} 的实例，如果设置为 `undefined` 或者 `null` 则不计算超时，单位：毫秒
 * @property {?Number} [syncAllDataTimeout=undefined] - 进行完整同步时的超时时间，其他方面与 `{@link defaultOption.timeout}` 相同
 * @property {Number} [debounce=5000] - 在多久时间内多次调用 `do()` 会合并为一次同步请求，单位：毫秒
 * @property {Number} [blockRetryInterval=5000] - 被 `canStartSyncNow()` 阻塞同步多久后再调用 `canStartSyncNow()`，单位：毫
 * @property {Thinker~Logger} logger - 日志收集器
 * @property {Storage} storage - 读写本地存储，接收一个实现了 {@link https://developer.mozilla.org/en-US/docs/Web/API/Storage Storage 接口}的对象
 * @property {Boolean} [autoBackgroundCompletelySync=true] - 是否自动发起后台初次完整同步
 * @property {Number} [autoRetryRequestCount=5] - 发起同步请求失败后重试几次
 *
 * @property {Function} canStartSyncNow
 * @property {Function} sendRequest
 * @property {Function} getDataToSync
 * @property {Function} getAllDataToSync
 * @property {Function} getItems
 * @property {Function} updateLocalData
 * @property {Function} deserializeItem
 *
 * @namespace
 * @name defaultOption
 * @memberof Thinker
 */
export default {
  apiPrefix: 'https://api-ng.pomotodo.com',
  debounce: 1000 * 5,
  blockRetryInterval: 1000 * 5,
  logger: new MemoryLogger,
  storage: root.localStorage || new MemoryStorage,
  autoBackgroundCompletelySync: true,
  autoRetryRequestCount: 5,
  ...optionCallbacks,
}
