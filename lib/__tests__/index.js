const _ = require('lodash')
const lolex = require('lolex')
const Thinker = require('../index')
const {
  regThinkerEvents,
  FakeLogger,
  FakeStorage,
} = require('../../test_helpers')

Promise.defer = () => {
  const deferred = {}
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}

Thinker.prototype._doSync = jest.fn(() => {
  return Promise.defer().promise
})

describe('Thinker', function() {
  let clock

  beforeEach(() => {
    clock = lolex.install()
  })
  afterEach(() => {
    clock.uninstall()
  })

  describe('#do()', () => {
    let thinker, fireSyncDefer

    beforeEach(() => {
      thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        debounceWait: 1000 * 5,
      })

      thinker._fireSync = jest.fn(() => {
        fireSyncDefer = Promise.defer()
        return fireSyncDefer.promise
      })
    })

    it('reschedule fire sync after be called', () => {
      expect(thinker.status).toBe('waiting')
      thinker.do('test #do() 1')
      const originTimer = thinker._doDebounceTimer
      expect(thinker._fireSync).not.toBeCalled()
      clock.tick(1000)
      expect(thinker._fireSync).not.toBeCalled()
      thinker.do('test #do() 2')
      expect(thinker._doDebounceTimer).not.toBe(originTimer)
      expect(thinker._fireSync).not.toBeCalled()
      clock.tick(4000)
      expect(thinker._fireSync).not.toBeCalled()
      clock.tick(1000)
      expect(thinker._fireSync).toBeCalled()
    })

    it('add callback to `this._syncCallbacks` and add reason, option to `this._currentSync`', () => {
      const cb1 = jest.fn()
      const cb2 = jest.fn()
      thinker.do('test #do() 1', null, cb1)
      thinker.do('test #do() 2')
      thinker.do('test #do() 3', {syncAllData: true}, cb2)
      thinker.do('test #do() 4', {syncAllData: true})
      expect(thinker._syncCallbacks[0]).toBe(cb1)
      expect(thinker._syncCallbacks[1]).toBeUndefined()
      expect(thinker._syncCallbacks[2]).toBe(cb2)
      expect(thinker._syncCallbacks[3]).toBeUndefined()
      expect(thinker._currentSync).toEqual([
        {reason: 'test #do() 1', passInOption: null},
        {reason: 'test #do() 2', passInOption: undefined},
        {reason: 'test #do() 3', passInOption: {syncAllData: true}},
        {reason: 'test #do() 4', passInOption: {syncAllData: true}},
      ])
    })

    it('schedule next sync if status is `processing`', () => {
      thinker.status = 'processing'
      const cb1 = jest.fn()
      const cb2 = jest.fn()
      thinker.do('test #do() 1', null, cb1)
      thinker.do('test #do() 2')
      thinker.do('test #do() 3', {syncAllData: true}, cb2)
      thinker.do('test #do() 4', {syncAllData: true})
      expect(thinker._syncCallbacks[0]).toBe(cb1)
      expect(thinker._syncCallbacks[1]).toBeUndefined()
      expect(thinker._syncCallbacks[2]).toBe(cb2)
      expect(thinker._syncCallbacks[3]).toBeUndefined()
      expect(thinker._nextSync).toEqual([
        {reason: 'test #do() 1', passInOption: null},
        {reason: 'test #do() 2', passInOption: undefined},
        {reason: 'test #do() 3', passInOption: {syncAllData: true}},
        {reason: 'test #do() 4', passInOption: {syncAllData: true}},
      ])
    })

    it('fire event `preparing` immediately', () => {
      const eventFns = regThinkerEvents(thinker)
      expect(eventFns.preparing).not.toBeCalled()
      thinker.do('test #do() fire event')
      expect(eventFns.preparing).toBeCalled()
    })

    it('throw error if reason is not filled', () => {
      expect(() => thinker.do()).toThrowError('[Thinker] reason is required')
    })
  })

  describe('#_fireSync()', () => {
    let thinker

    beforeEach(() => {
      thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        debounceWait: 1000 * 5,
      })
    })

    it('clean fire sync timer immediately', () => {
      const doDebounceTimerCB = jest.fn()
      thinker._doDebounceTimer = setTimeout(doDebounceTimerCB, 1000)
      thinker._callSync = jest.fn(() => Promise.defer().promise)
      thinker._fireSync()
      expect(thinker._doDebounceTimer).toBeNull()
      clock.tick(1001)
      expect(doDebounceTimerCB).not.toBeCalled()
    })

    it('fire event `succeed` and execute `this._syncCallbacks` if `#_callSync()` succeed', () => {
      let callSyncDefer
      const syncCallbacks = [jest.fn(), null, undefined, 0, '2333', jest.fn()]
      const eventFns = regThinkerEvents(thinker)
      thinker._callSync = jest.fn(() => {
        callSyncDefer = Promise.defer()
        return callSyncDefer.promise
      })
      thinker._syncCallbacks = syncCallbacks.slice(0)
      expect(eventFns.succeed).not.toBeCalled()
      thinker._fireSync()
      expect(thinker._callSync).toBeCalled()
      callSyncDefer.resolve()
      expect(thinker.status).toBe('succeed')
      expect(eventFns.succeed).toBeCalled()
      expect(thinker._syncCallbacks).not.toBe(syncCallbacks)
      expect(syncCallbacks[0]).toBeCalled()
      expect(syncCallbacks[5]).toBeCalled()
    })

    it('fire event `failed` and execute `this._syncCallbacks` if `#_callSync()` failed', () => {
      let callSyncDefer
      const rejectError = new Error
      const syncCallbacks = [jest.fn(), null, undefined, 0, '2333', jest.fn()]
      const eventFns = regThinkerEvents(thinker)
      thinker._callSync = jest.fn(() => {
        callSyncDefer = Promise.defer()
        return callSyncDefer.promise
      })
      thinker._syncCallbacks = syncCallbacks.slice(0)
      expect(eventFns.failed).not.toBeCalled()
      thinker._fireSync()
      expect(thinker._callSync).toBeCalled()
      callSyncDefer.reject(rejectError)
      expect(thinker.status).toBe('failed')
      expect(eventFns.failed).toBeCalledWith(rejectError)
      expect(thinker._syncCallbacks).not.toBe(syncCallbacks)
      expect(syncCallbacks[0]).toBeCalledWith(rejectError)
      expect(syncCallbacks[5]).toBeCalledWith(rejectError)
    })

    it('switch status from succeed to waiting automatically', () => {
      let callSyncDefer
      thinker._callSync = jest.fn(() => {
        callSyncDefer = Promise.defer()
        return callSyncDefer.promise
      })
      thinker._fireSync()
      callSyncDefer.resolve()
      expect(thinker.status).toBe('succeed')
      clock.tick(2000)
      expect(thinker.status).toBe('waiting')
    })

    it('switch status from failed to waiting automatically', () => {
      let callSyncDefer
      const rejectError = new Error
      thinker._callSync = jest.fn(() => {
        callSyncDefer = Promise.defer()
        return callSyncDefer.promise
      })
      thinker._fireSync()
      callSyncDefer.reject(rejectError)
      expect(thinker.status).toBe('failed')
      clock.tick(2000)
      expect(thinker.status).toBe('waiting')
    })
  })

  describe('#_callSync()', () => {
    let thinker, canSyncDefer, doSyncDefer

    const genSyncInfo = (opt) => {
      const options = _.extend({all: true}, opt)
      return [
        {reason: 'test #_callSync() 1', passInOption: {}},
        {reason: 'test #_callSync() 2', passInOption: null},
        {reason: 'test #_callSync() 3', passInOption: {syncAllData: options.all}},
        {reason: 'test #_callSync() 4', passInOption: undefined},
        {reason: 'test #_callSync() 5', passInOption: undefined},
      ]
    }

    beforeEach(() => {
      thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        debounceWait: 1000 * 5,
      })

      thinker._waitUntilCanSync = jest.fn(() => {
        canSyncDefer = Promise.defer()
        return canSyncDefer.promise
      })
      thinker._doSync = jest.fn(() => {
        doSyncDefer = Promise.defer()
        return doSyncDefer.promise
      })
      thinker._callSync = jest.fn(thinker._callSync)

      thinker.status = 'preparing'

      thinker._currentSync = genSyncInfo()
    })

    it('set status blocking immediately', () => {
      const eventFns = regThinkerEvents(thinker)
      thinker._callSync()
      expect(thinker.status).toBe('blocking')
      expect(eventFns.blocking).toBeCalled()
      expect(thinker._waitUntilCanSync).toBeCalledWith({
        passInOptions: [{}, null, {syncAllData: true}, undefined, undefined],
        isFirstTime: true,
      })
    })

    it('set status processing and call `#_doSync()` immediately after can sync', () => {
      const eventFns = regThinkerEvents(thinker)
      thinker._callSync()
      expect(thinker.status).toBe('blocking')
      canSyncDefer.resolve(true)
      expect(thinker.status).toBe('processing')
      expect(eventFns.processing).toBeCalled()
      expect(thinker._doSync).toBeCalledWith({
        passInOptions: [{}, null, {syncAllData: true}, undefined, undefined],
        isFirstTime: true,
      }, {
        syncAllData: true,
      })
    })

    it('start another `#_callSync()` if exist next sync info', () => {
      const eventFns = regThinkerEvents(thinker)
      const callSyncSuccess = jest.fn()

      thinker._callSync().then(callSyncSuccess)
      canSyncDefer.resolve(true)
      doSyncDefer.resolve()
      expect(callSyncSuccess.mock.calls.length).toBe(1)
      expect(thinker._callSync.mock.calls.length).toBe(1)

      const nextSync = genSyncInfo({all: false})
      thinker._nextSync = nextSync
      thinker._callSync().then(callSyncSuccess)
      canSyncDefer.resolve(true)
      doSyncDefer.resolve()
      expect(callSyncSuccess.mock.calls.length).toBe(1)
      expect(thinker._callSync.mock.calls.length).toBe(3)
      expect(thinker._nextSync).toEqual([])
      expect(thinker._currentSync).toBe(nextSync)
      canSyncDefer.resolve(true)
      doSyncDefer.resolve()
      expect(callSyncSuccess.mock.calls.length).toBe(2)
      expect(thinker._callSync.mock.calls.length).toBe(3)
    })
  })

  describe('#_waitUntilCanSync()', () => {
    let thinker

    beforeEach(() => {
      thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        debounceWait: 1000 * 5,
      })
    })

    it('works')
  })

  describe('#_doSync()', () => {
    let thinker

    beforeEach(() => {
      thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        debounceWait: 1000 * 5,
      })
    })

    it('works')
  })

  describe('initOption.debounceWait', function() {
    beforeEach(function() {
      this.canStartSyncNow = jest.fn((syncInfo, cb) => cb(null, false))
      this.thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        debounceWait: 1000 * 5,
        canStartSyncNow: this.canStartSyncNow,
      })
    })

    it('make thinker wait', function() {
      expect(this.thinker.status).toBe('waiting')
      this.thinker.do('test initOption.debounceWait')
      expect(this.thinker.status).toBe('preparing')
      clock.tick(1000)
      expect(this.thinker.status).toBe('preparing')
      expect(this.canStartSyncNow.mock.calls.length).toBe(0)
      clock.tick(4000)
      expect(this.thinker.status).toBe('blocking')
      expect(this.canStartSyncNow.mock.calls.length).toBe(1)
    })
  })

  describe('initOption.autoBackgroundCompletelySync', function() {
    beforeEach(function() {
      this.thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        autoBackgroundCompletelySync: true,
        sendRequest: this.sendRequestFn = jest.fn(function(syncInfo, requestInfo, cb) {
          cb(null, {
            config: requestInfo,
            status: 200,
            headers: {},
            data: {
              last_sync: "2016-09-19T11:06:43.828Z",
              objects: {}
            }
          })
        }),
        getDataToSync: this.getDataToSyncFn = jest.fn(function(syncInfo, cb) {
          cb(null, {
            todos: {
              todo1: {
                id: 'todo1',
                updated_at: '2016-09-19T16:06:00Z'
              }
            }
          })
        }),
        getAllDataToSync: this.getAllDataToSyncFn = jest.fn(function(syncInfo, cb) {
          cb(null, {
            todos: {
              todo1: {
                id: 'todo1',
                updated_at: '2016-09-19T16:06:00Z'
              },
              todo2: {
                id: 'todo2',
                updated_at: '2016-09-19T16:06:00Z'
              }
            }
          })
        })
      })
    })

    it('make background completely sync after first sync', function() {
      this.thinker.do('test initOption.autoBackgroundCompletelySync')
      clock.tick(5000)
    })
  })

  describe('initOption.canStartSyncNow', () => {
    let canStartSyncNowFn, thinker, deferCb

    beforeEach(() => {
      canStartSyncNowFn = jest.fn((syncInfo, cb) => {
        deferCb = Promise.defer()
        deferCb.promise.then((result) => {
          return cb(null, result)
        }, (err) => {
          return cb(err)
        })
      })

      thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        canStartSyncNow: canStartSyncNowFn,
        debounceWait: 10,
      })
    })

    it('be called before sync', function() {
      thinker.do('test initOption.canStartSyncNow', {test: true})
      expect(thinker.status).toBe('preparing')
      expect(canStartSyncNowFn).not.toBeCalled()
      clock.tick(20)
      expect(thinker.status).toBe('blocking')
      expect(canStartSyncNowFn).toBeCalled()
      deferCb.resolve(true)
      expect(thinker._doSync).toBeCalled()
      expect(thinker.status).toBe('processing')
    })

    it('can block sync', function() {
      thinker.do('test initOption.canStartSyncNow')
      expect(thinker.status).toBe('preparing')
      expect(canStartSyncNowFn).not.toBeCalled()
      clock.tick(10)
      expect(canStartSyncNowFn).toBeCalled()
      deferCb.resolve(false)
      expect(thinker.status).toBe('blocking')
    })
  })
})
