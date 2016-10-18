const CONSTS = require('./constants')
const utils = require('./utils')
const _ = require('lodash')

module.exports = (Thinker) => {
  _.extend(Thinker.prototype, {
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
    backgroundInitializeCompletelySyncSucceed: false,
  })

  Object.defineProperties(Thinker.prototype, {
    /**
     * 最后一次同步成功的时间
     *
     * @type {Date}
     * @alias lastSuccessTime
     * @memberof Thinker#
     */
    lastSuccessTime: {
      get() {
        return utils.parseValidDate(this.initOption.storage.getItem(CONSTS.LAST_SYNC_STORAGE_KEY))
      }
    },

    /**
     * 最后一次同步失败的时间
     *
     * @type {Date}
     * @alias lastSuccessTime
     * @memberof Thinker#
     */
    lastFailTime: {
      get() {
        return utils.parseValidDate(this.initOption.storage.getItem(CONSTS.LAST_SYNC_FAIL_STORAGE_KEY))
      }
    },
  })
}