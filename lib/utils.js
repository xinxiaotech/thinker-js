const _map = require('lodash/map')
const _toPairs = require('lodash/toPairs')
const _fromPairs = require('lodash/fromPairs')
const _isString = require('lodash/isString')

const utils = {
  isPromise(obj) {
    return obj && typeof obj.then === 'function'
  },

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
    const pairedPromises = _toPairs(promises)
    return Promise.all(_map(pairedPromises, (pair) => pair[1])).then((results) => {
      const pairedResults = results.reduce((memo, result, index) => {
        memo[index] = [pairedPromises[index][0], result]
        return memo
      }, [])
      return _fromPairs(pairedResults)
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

  try(fn, ...args) {
    if (args.length === 1 && Array.isArray(args[0])) {
      args = args[0]
    }

    return new Promise((resolve, reject) => {
      let result = fn(...args)
      if (!utils.isPromise(result)) {
        result = Promise.resolve(result)
      }
      result.then(resolve, reject)
    })
  },

  // 1,  3,  30,  90, 900, 2700, 27000, 81000, 810000
  // 1s, 3s, 30s, 3m, 15m, 45m , 7.5h , 22.5h,   225h
  // 0.1, lastResult * 10, lastResult * 3, lastResult * 10, lastResult * 3, lastResult * 10, ...
  //
  // @param {Function} fn - 要自动重试的函数
  // @param {Object} passInOption
  // @param {Number} passInOption.maxRetryCount - 最大自动重试数，如果为 0 就无限重试，默认为 5
  // @return {Object} obj
  // @return {Promsie} obj.promise - 重试流程的 Promise ，只有在重试成功、重试次数到达上限、重试流程被终止时才会结束
  // @return {Function} obj.cancel - 终止重试流程
  // @return {Function} obj.isCanceled - 重试流程是否已经被终止
  // @return {Function} obj.triedTimes - 已经重试多少次
  delayRetry: (() => {
    let defaultOption = {maxRetryCount: 5}

    return (fn, passInOption, _internalState) => {
      const defer = utils.pending()

      if (_internalState && _internalState.canceled) {
        defer.reject(_internalState.lastTimeFailedReason)
      } else {
        fn = (typeof fn === 'function' ? fn : () => {})
        _internalState = (_internalState || {retriedTimes: 0, lastOutSecond: 0.1, canceled: false, lastTimeFailedReason: null})
        const option = {
          ...defaultOption,
          ...passInOption,
        }

        utils.try(fn, _internalState.retriedTimes + 1).catch((err) => {
          _internalState.lastTimeFailedReason = err
          if ((_internalState.retriedTimes >= option.maxRetryCount) || _internalState.canceled) {
            return Promise.reject(err)
          } else {
            _internalState.retriedTimes += 1
            _internalState.lastOutSecond = _internalState.lastOutSecond * (_internalState.retriedTimes % 2 ? 10 : 3)
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                utils.delayRetry(fn, option, _internalState).promise.then(resolve, reject)
              }, _internalState.lastOutSecond * 1000)
            })
          }
        }).then(defer.resolve, defer.reject)
      }

      return {
        promise: defer.promise,
        isCanceled() { return _internalState.canceled },
        triedTimes() { return _internalState.retriedTimes },
        cancel() {
          if (_internalState.lastTimeFailedReason == null) {
            defer.reject()
          } else {
            defer.reject(_internalState.lastTimeFailedReason)
          }
          _internalState.canceled = true
        },
      }
    }
  })(),

  parseValidDate(obj) {
    let date
    if (Object.prototype.toString.call(obj) === '[object Date]') {
      date = obj
    } else if (_isString(obj) && /^\d+$/.test(obj)) {
      date = new Date(parseInt(obj, 10))
    } else {
      date = new Date(obj)
    }
    return isNaN(date.getTime()) ? null : date
  },
}

module.exports = utils
