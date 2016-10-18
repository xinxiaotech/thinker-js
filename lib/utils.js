const global = this
let _
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  _ = require('lodash')
} else {
  _ = global._
}

const utils = {
  denodify(owner, fnName) {
    return (...args) => {
      return new Promise((resolve, reject) => {
        owner[fnName].apply(owner, args.concat((err, result) => {
          err ? reject(err) : resolve(result)
        }))
      })
    }
  },

  props(promises) {
    const pairedPromises = _.toPairs(promises)
    return Promise.all(_.map(pairedPromises, (pair) => pair[1])).then((results) => {
      const pairedResults = results.reduce((memo, result, index) => {
        memo[index] = [pairedPromises[index][0], result]
        return memo
      }, [])
      return _.fromPairs(pairedResults)
    })
  },

  pending() {
    const result = {}
    result.promise = new Promise((resolve, reject) => {
      result.resolve = resolve
      result.reject = reject
    })
    return result
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
  delayRetry: (() => {
    let defaultOption = {maxRetryCount: 5}

    return (fn, passInOption, _internalState) => {
      fn = (typeof fn === 'function' ? fn : () => {})
      _internalState = (_internalState || {retriedTimes: 0, lastOutSecond: 0.1, canceled: false})
      const option = _.extend({}, defaultOption, passInOption)

      const promise = Promise.resolve(fn(_internalState.retriedTimes + 1)).catch((err) => {
        if ((_internalState.retriedTimes >= option.maxRetryCount) || _internalState.canceled) {
          return Promise.reject(err)
        } else {
          _internalState.retriedTimes += 1
          _internalState.lastOutSecond = _internalState.lastOutSecond * (_internalState.retriedTimes % 2 ? 10 : 3)
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              utils.delayRetry(fn, option, _internalState).then(resolve, reject)
            }, _internalState.lastOutSecond * 1000)
          })
        }
      })

      promise.cancel = () => {
        _internalState.canceled = true
      }

      return promise
    }
  })(),

  parseValidDate(obj) {
    const date = Object.prototype.toString.call(obj) === '[object Date]' ? obj : new Date(obj)
    return isNaN(date.getTime()) ? null : date
  },
}

module.exports = utils
