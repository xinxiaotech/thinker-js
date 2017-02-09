const lolex = require('lolex')
const Thinker = require('../../index')
const utils = require('../../utils')
const {
  FakeLogger,
} = require('../../../test_helpers')

describe('#_waitUntilCanSync()', () => {
  let fakeInitOption, fakeLogger, canStartSyncNowFn, deferCB, clock
  const waitUntilCanSync = Thinker.prototype._waitUntilCanSync
  const fakeSyncInfo = {}

  beforeEach(() => {
    clock = lolex.install()
    fakeLogger = new FakeLogger
    canStartSyncNowFn = jest.fn((syncInfo, cb) => { deferCB = cb })
    fakeInitOption = {
      ...Thinker.defaultOption,
      blockRetryInterval: 10,
      canStartSyncNow: canStartSyncNowFn,
      logger: fakeLogger,
    }
  })

  afterEach(() => {
    clock.uninstall()
  })

  it('check initOption.canStartSyncNow after per initOption.blockRetryInterval', () => {
    const waitCallback = jest.fn()
    expect(canStartSyncNowFn).not.toBeCalled()
    waitUntilCanSync(fakeSyncInfo, fakeInitOption).then(waitCallback, waitCallback)
    expect(fakeLogger.logs).toHaveLength(0)
    expect(canStartSyncNowFn).toBeCalledWith(fakeSyncInfo, expect.anything())
    expect(canStartSyncNowFn.mock.calls).toHaveLength(1)
    expect(deferCB).toEqual(expect.any(Function))
    deferCB(null, false)
    expect(waitCallback).not.toBeCalled()
    expect(fakeLogger.logs).toHaveLength(1)
    clock.tick(10)
    expect(canStartSyncNowFn.mock.calls).toHaveLength(2)
    deferCB(null, false)
    expect(waitCallback).not.toBeCalled()
    expect(fakeLogger.logs).toHaveLength(2)
    clock.tick(10)
    expect(canStartSyncNowFn.mock.calls).toHaveLength(3)
    deferCB(null, false)
    expect(waitCallback).not.toBeCalled()
    expect(fakeLogger.logs).toHaveLength(3)
  })

  it('wait initOption.canStartSyncNow callback', () => {
    const waitCallback = jest.fn()
    expect(canStartSyncNowFn).not.toBeCalled()
    waitUntilCanSync(fakeSyncInfo, fakeInitOption).then(waitCallback, waitCallback)
    expect(fakeLogger.logs).toHaveLength(0)
    expect(canStartSyncNowFn.mock.calls).toHaveLength(1)
    expect(waitCallback).not.toBeCalled()
    clock.tick(10)
    expect(canStartSyncNowFn.mock.calls).toHaveLength(1)
    expect(waitCallback).not.toBeCalled()
    expect(fakeLogger.logs).toHaveLength(0)
    clock.tick(10)
    expect(canStartSyncNowFn.mock.calls).toHaveLength(1)
    expect(waitCallback).not.toBeCalled()
    expect(fakeLogger.logs).toHaveLength(0)
    deferCB(null, false)
    clock.tick(10)
    expect(canStartSyncNowFn.mock.calls).toHaveLength(2)
    expect(waitCallback).not.toBeCalled()
    expect(fakeLogger.logs).toHaveLength(1)
    deferCB(null, true)
    expect(waitCallback).toBeCalledWith(undefined)
    expect(fakeLogger.logs).toHaveLength(1)
  })

  it('can handle error', () => {
    const waitCallback = jest.fn()
    const err = new Error
    waitUntilCanSync(fakeSyncInfo, fakeInitOption).then(waitCallback, waitCallback)
    deferCB(err)
    expect(waitCallback).toBeCalledWith(err)
  })

  it('support block by some reason', () => {
    const waitCallback = jest.fn()
    const blockReason = 'block reason' + Math.random()
    waitUntilCanSync(fakeSyncInfo, fakeInitOption).then(waitCallback, waitCallback)
    deferCB(null, blockReason)
    expect(waitCallback).not.toBeCalled()
    expect(fakeLogger.logs[0]).toEqual([`[Thinker] sync blocked by ${blockReason}, will try again after ${fakeInitOption.blockRetryInterval / 1000} seconds`])
  })
})
