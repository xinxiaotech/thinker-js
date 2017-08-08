const lolex = require('lolex')
const Thinker = require('../../index')
const utils = require('../../utils')
const MemoryLogger = require('../../memory_logger').default
const MemoryStorage = require('../../memory_storage')

describe('#_intoSync()', () => {
  let clock, thinker, callbacks, fakeThinker, fakeLogger, callSyncDefer

  beforeEach(() => {
    clock = lolex.install()
    callbacks = [jest.fn(), null, undefined, 0, '2333', jest.fn()]
    callSyncDefer = utils.pending()
    fakeLogger = new MemoryLogger
    fakeThinker = {
      initOption: { logger: fakeLogger },
      _changeStatus: jest.fn(),
      _syncCallbacks: callbacks,
      _callSync: jest.fn(() => callSyncDefer.promise),
      _intoSync: Thinker.prototype._intoSync,
    }
  })

  afterEach(() => {
    clock.uninstall()
  })

  it('switch status to `succeed` and execute `#_syncCallbacks` if `#_callSync()` succeed', () => {
    fakeThinker._intoSync()
    expect(fakeThinker._callSync).toBeCalledWith()
    callSyncDefer.resolve()
    expect(fakeThinker._changeStatus).toBeCalledWith('succeed')
    expect(fakeThinker._syncCallbacks).not.toBe(callbacks)
    expect(callbacks[0]).toBeCalledWith()
    expect(callbacks[5]).toBeCalledWith()
    expect(fakeThinker._autoSwitchStatusTimer != null).toBe(true)
    clock.tick(2000)
    expect(fakeThinker._changeStatus).toBeCalledWith('waiting')
    expect(fakeThinker._autoSwitchStatusTimer != null).toBe(false)
  })

  it('switch status to `failed` and execute `#_syncCallbacks` if `#_callSync()` failed', () => {
    const rejectError = new Error
    fakeThinker._intoSync()
    expect(fakeThinker._callSync).toBeCalledWith()
    callSyncDefer.reject(rejectError)
    expect(fakeThinker._changeStatus).toHaveBeenCalledTimes(1)
    expect(fakeThinker._changeStatus).toBeCalledWith('failed', [rejectError])
    expect(fakeThinker._syncCallbacks).not.toBe(callbacks)
    expect(callbacks[0]).toBeCalledWith(rejectError)
    expect(callbacks[5]).toBeCalledWith(rejectError)
    expect(fakeThinker._autoSwitchStatusTimer != null).toBe(true)
    clock.tick(2000)
    expect(fakeThinker._changeStatus).toHaveBeenCalledTimes(1)
    expect(fakeThinker._autoSwitchStatusTimer != null).toBe(false)
  })
})
