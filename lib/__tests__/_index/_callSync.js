const _ = require('lodash')
const Thinker = require('../../index')
const utils = require('../../utils')
const {
  FakeLogger,
  FakeStorage,
} = require('../../../test_helpers')

describe('#_callSync()', () => {
  let thinker, canSyncDefer, doSyncDefer

  const genSyncInfo = (opt) => {
    const options = {
      all: true,
      ...opt,
    }
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
    })
    thinker._currentSync = genSyncInfo()
    thinker._waitUntilCanSync = jest.fn(() => {
      canSyncDefer = utils.pending()
      return canSyncDefer.promise
    })
    thinker._doSync = jest.fn(() => {
      doSyncDefer = utils.pending()
      return doSyncDefer.promise
    })
    thinker._callSync = jest.fn(thinker._callSync)
    thinker._changeStatus = jest.fn(thinker._changeStatus)
    thinker._tryToStartSecondSync = jest.fn(thinker._tryToStartSecondSync)

    thinker.status = 'preparing'
  })

  it('change status to processing and call `#_doSync()` immediately after can sync', () => {
    const callSyncSuccess = jest.fn()
    thinker._callSync().then(callSyncSuccess)

    expect(thinker._changeStatus).toBeCalledWith('blocking')
    expect(thinker._waitUntilCanSync).toBeCalledWith({
      passInOptions: [{}, null, {syncAllData: true}, undefined, undefined],
      isFirstTime: true,
    }, thinker.initOption)
    canSyncDefer.resolve(true)

    expect(thinker._changeStatus).toBeCalledWith('processing')
    expect(thinker._doSync).toBeCalledWith({
      passInOptions: [{}, null, {syncAllData: true}, undefined, undefined],
      isFirstTime: true,
    }, {
      syncAllData: true,
    })
    doSyncDefer.resolve('any thing')

    expect(thinker._tryToStartSecondSync).toBeCalledWith(false, 1, 'any thing')
    expect(callSyncSuccess.mock.calls).toHaveLength(1)
    expect(thinker._callSync.mock.calls).toHaveLength(1)
  })

  it('exec `#_callSync()` twice if exist next sync info', () => {
    const callSyncSuccess = jest.fn()
    const nextSync = genSyncInfo({all: false})
    thinker._nextSync = nextSync
    thinker._callSync().then(callSyncSuccess)
    canSyncDefer.resolve(true)
    doSyncDefer.resolve()
    expect(callSyncSuccess).not.toBeCalled()
    expect(thinker._tryToStartSecondSync).toBeCalledWith(false, 1, undefined)
    expect(thinker._callSync.mock.calls).toHaveLength(2)
    expect(thinker._callSync).lastCalledWith(2)
    expect(thinker._nextSync).toEqual([])
    expect(thinker._currentSync).toBe(nextSync)
    canSyncDefer.resolve(true)
    doSyncDefer.resolve()
    expect(callSyncSuccess).toBeCalled()
    expect(thinker._callSync.mock.calls).toHaveLength(2)
  })
})
