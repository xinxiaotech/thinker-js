const _ = require('lodash')
const Thinker = require('../../index')
const utils = require('../../utils')
const {
  regThinkerEvents,
  FakeLogger,
  FakeStorage,
} = require('../../../test_helpers')

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
      canSyncDefer = utils.pending()
      return canSyncDefer.promise
    })
    thinker._doSync = jest.fn(() => {
      doSyncDefer = utils.pending()
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
