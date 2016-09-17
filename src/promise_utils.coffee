
module.exports = {
  denodify: (owner, fnName) ->
    ->
      new Promise (resolve, reject) ->
        owner[fnName]? arguments..., (err, result) ->
          if err then reject(err) else resolve(result)

  props: (promises) ->
    pairedPromises = _.toPairs promises
    Promise.all(_.map pairedPromises, (pair) -> pair[1]).then (results) ->
      pairedResults = results.reduce (memo, result, index) ->
        memo[index] = [pairedPromises[index][0], result]
        memo
      , []
      _.fromPairs pairedResults

  pending: ->
    result = {}
    result.promise = new Promise ->
      result.resolve = arguments[0]
      result.reject = arguments[1]
    result

  # 1,  3,  30,  90, 900, 2700, 27000, 81000, 810000
  # 1s, 3s, 30s, 3m, 15m, 45m , 7.5h , 22.5h,   225h
  # 0.1, lastResult * 10, lastResult * 3, lastResult * 10, lastResult * 3, lastResult * 10, ...
  #
  # @param {Function} fn - 要自动重试的函数
  # @param {Object} passInOption
  # @param {Number} passInOption.maxRetryCount - 最大自动重试数，如果为 0 就无限重试，默认为 5
  # @return {Promsie} promise
  # @return {Function} promise.cancel - 终止重试流程
  delayRetry: do ->
    defaultOption = maxRetryCount: 5

    (fn, passInOption, _internalState) ->
      _internalState ?= retriedTimes: 0, lastOutSecond: 0.1, canceled: false
      option = _.extend defaultOption, passInOption

      promise = Promise.resolve(fn?(_internalState.retriedTimes + 1)).catch (err) ->
        if _internalState.retriedTimes >= option.maxRetryCount or _internalState.canceled
          Promise.reject(err)
        else
          _internalState.retriedTimes += 1
          _internalState.lastOutSecond = _internalState.lastOutSecond * (if _internalState.retriedTimes % 2 then 10 else 3)
          new Promise (resolve, reject) ->
            setTimeout ->
              promiseUtils.delayRetry(fn, option, _internalState).then(resolve, reject)
            , _internalState.lastOutSecond * 1000

      promise.cancel = ->
        _internalState.canceled = true

      promise
}
