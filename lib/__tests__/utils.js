import lolex from 'lolex'
import utils from '../utils'

describe('utils', () => {
  describe('.delayRetry', () => {
    let clock, fn, fnDefer

    beforeEach(() => {
      fn = jest.fn(time => {
        fnDefer = utils.pending()
        return fnDefer.promise
      })
      clock = lolex.install()
    })

    afterEach(() => {
      clock.uninstall()
    })

    it('retry function until match option.maxRetryCount', () => {
      const retryCallback = jest.fn()
      const retryInfo = utils.delayRetry(fn, {maxRetryCount: 4})
      retryInfo.promise.then(retryCallback, retryCallback)
      expect(retryInfo).toEqual({
        promise: expect.any(Promise),
        isCanceled: expect.any(Function),
        triedTimes: expect.any(Function),
        cancel: expect.any(Function),
      })
      expect(fn).toHaveBeenCalledWith(1)
      expect(retryInfo.isCanceled()).toBe(false)
      expect(retryInfo.triedTimes()).toBe(0)
      fnDefer.reject(new Error)
      expect(fn).toHaveBeenCalledWith(1)

      clock.tick(1000 * 1)
      expect(fn).toHaveBeenCalledWith(2)
      expect(retryInfo.isCanceled()).toBe(false)
      expect(retryInfo.triedTimes()).toBe(1)
      fnDefer.reject(new Error)
      expect(fn).toHaveBeenCalledWith(2)

      clock.tick(1000 * 3)
      expect(fn).toHaveBeenCalledWith(3)
      expect(retryInfo.isCanceled()).toBe(false)
      expect(retryInfo.triedTimes()).toBe(2)
      fnDefer.reject(new Error)
      expect(fn).toHaveBeenCalledWith(3)

      clock.tick(1000 * 30)
      expect(fn).toHaveBeenCalledWith(4)
      expect(retryInfo.isCanceled()).toBe(false)
      expect(retryInfo.triedTimes()).toBe(3)
      fnDefer.reject(new Error)
      expect(fn).toHaveBeenCalledWith(4)

      const finalError = new Error
      clock.tick(1000 * 90)
      expect(fn).toHaveBeenCalledWith(5)
      expect(retryInfo.isCanceled()).toBe(false)
      expect(retryInfo.triedTimes()).toBe(4)
      fnDefer.reject(finalError)
      expect(fn).toHaveBeenCalledWith(5)

      expect(retryCallback).toHaveBeenCalledTimes(1)
      expect(retryCallback).toHaveBeenCalledWith(finalError)
    })

    it('finish progress if function resolved promise', () => {
      const retryCallback = jest.fn()
      const retryInfo = utils.delayRetry(fn)
      retryInfo.promise.then(retryCallback, retryCallback)
      expect(retryInfo).toEqual({
        promise: expect.any(Promise),
        isCanceled: expect.any(Function),
        triedTimes: expect.any(Function),
        cancel: expect.any(Function),
      })
      expect(fn).toHaveBeenCalledWith(1)
      fnDefer.reject(new Error)
      expect(fn).toHaveBeenCalledWith(1)

      const fakeData = {fn: {fake: true}}
      clock.tick(1000 * 1)
      expect(fn).toHaveBeenCalledWith(2)
      fnDefer.resolve(fakeData)
      expect(fn).toHaveBeenCalledWith(2)

      expect(retryInfo.isCanceled()).toBe(false)
      expect(retryInfo.triedTimes()).toBe(1)
      expect(retryCallback).toHaveBeenCalledTimes(1)
      expect(retryCallback).toHaveBeenCalledWith(fakeData)
    })

    it('support cancel retry progress', () => {
      const retryCallback = jest.fn()
      const retryInfo = utils.delayRetry(fn)
      retryInfo.promise.then(retryCallback, retryCallback)
      expect(retryInfo).toEqual({
        promise: expect.any(Promise),
        isCanceled: expect.any(Function),
        triedTimes: expect.any(Function),
        cancel: expect.any(Function),
      })
      const lastError = new Error
      expect(fn).toHaveBeenCalledWith(1)
      fnDefer.reject(lastError)
      expect(fn).toHaveBeenCalledWith(1)

      clock.tick(1000 * 1)
      expect(fn).toHaveBeenCalledWith(2)
      retryInfo.cancel()

      expect(retryInfo.isCanceled()).toBe(true)
      expect(retryInfo.triedTimes()).toBe(1)
      expect(retryCallback).toHaveBeenCalledTimes(1)
      expect(retryCallback).toHaveBeenCalledWith(lastError)
    })
  })

  describe('.parseValidDate', () => {
    it('support native Date instance', () => {
      const date = new Date
      expect(utils.parseValidDate(date)).toBe(date)
    })

    it('support stringified Integer', () => {
      expect(utils.parseValidDate('112233')).toEqual(new Date(112233))
    })

    it('support Date constructor supported formats', () => {
      expect(utils.parseValidDate('Mon Feb 13 2017 12:46:30 GMT+0800 (CST)'))
        .toEqual(new Date('Mon Feb 13 2017 12:46:30 GMT+0800 (CST)'))
    })

    it('return null if input not valid', () => {
      expect(utils.parseValidDate('not valid datetime')).toBe(null)
    })
  })
})
