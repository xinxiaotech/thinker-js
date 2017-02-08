const lolex = require('lolex')
const Thinker = require('../../index')
const utils = require('../../utils')
const {
  regThinkerEvents,
  FakeLogger,
  FakeStorage,
} = require('../../../test_helpers')

describe('#_fireSync()', () => {
  let clock, thinker

  beforeEach(() => {
    clock = lolex.install()
  })
  afterEach(() => {
    clock.uninstall()
  })

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
    thinker._callSync = jest.fn(() => utils.pending().promise)
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
      callSyncDefer = utils.pending()
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
      callSyncDefer = utils.pending()
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
      callSyncDefer = utils.pending()
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
      callSyncDefer = utils.pending()
      return callSyncDefer.promise
    })
    thinker._fireSync()
    callSyncDefer.reject(rejectError)
    expect(thinker.status).toBe('failed')
    clock.tick(2000)
    expect(thinker.status).toBe('waiting')
  })
})
