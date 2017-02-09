import Thinker from '../../'
import utils from '../../utils'
import MemoryLogger from '../../memory_logger'
import MemoryStorage from '../../memory_storage'
import CONSTS from '../../constants'

describe('#_tryToTriggerBackgroundInitializeCompletelySync', () => {
  let thinker, fakeStorage, doSyncDefer

  beforeEach(() => {
    fakeStorage = new MemoryStorage
    thinker = new Thinker({
      storage: fakeStorage,
      logger: new MemoryLogger,
    })
    thinker.trigger = jest.fn(thinker.trigger)
    thinker._doSync = jest.fn((syncInfo, option) => {
      if (doSyncDefer && doSyncDefer.promise.isPending()) {
        return doSyncDefer.promise
      } else {
        doSyncDefer = utils.pending()
        return doSyncDefer.promise
      }
    })
  })

  it('trigger background initialize completely sync if never triggered', () => {
    const fakeSyncInfo = { passInOptions: [{syncAllData: false}] }
    thinker._tryToTriggerBackgroundInitializeCompletelySync(fakeSyncInfo, {syncAllData: false})
    expect(thinker._doSync.mock.calls).toHaveLength(1)
    expect(thinker._doSync).toBeCalledWith({
      passInOptions: [{syncAllData: false}, {syncAllData: true}],
      isFirstTime: false,
      background: true,
    }, {syncAllData: true})
    doSyncDefer.resolve()
    expect(fakeStorage.store[CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY] = 'true')
    expect(thinker.trigger).lastCalledWith('backgroundInitializeCompletelySyncSucceed')
    expect(thinker._doSync.mock.calls).toHaveLength(1)
  })

  it('handle error in background initialize completely sync and retry in next #_doSync', () => {
    const fakeSyncInfo = { passInOptions: [{syncAllData: false}] }

    thinker._tryToTriggerBackgroundInitializeCompletelySync(fakeSyncInfo, {syncAllData: false})
    doSyncDefer.reject(new Error)
    expect(fakeStorage.store[CONSTS.INIT_COMPLETELY_SYNC_STATUS_STORAGE_KEY]).toBe(undefined)
    expect(thinker.trigger).not.toBeCalled()
    expect(thinker._doSync.mock.calls).toHaveLength(1)

    thinker._tryToTriggerBackgroundInitializeCompletelySync(fakeSyncInfo, {syncAllData: false})
    doSyncDefer.resolve()
    expect(thinker.trigger.mock.calls).toHaveLength(1)
    expect(thinker.trigger).lastCalledWith('backgroundInitializeCompletelySyncSucceed')
    expect(thinker._doSync.mock.calls).toHaveLength(2)
    expect(thinker._doSync).toBeCalledWith({
      passInOptions: [{syncAllData: false}, {syncAllData: true}],
      isFirstTime: false,
      background: true,
    }, {syncAllData: true})
  })

  it("won't trigger if doing background initialize completely sync", () => {
    const fakeSyncInfo = { passInOptions: [{syncAllData: false}] }
    let doSyncDefer, doSyncCallback
    thinker._doSync = jest.fn((...args) => {
      doSyncDefer = utils.pending()
      doSyncCallback = jest.fn()
      return doSyncDefer.promise.then(() =>
        Thinker.prototype._doSync.call(thinker, ...args)
      ).then(doSyncCallback, doSyncCallback)
    })
    thinker._tryToTriggerBackgroundInitializeCompletelySync(fakeSyncInfo, {syncAllData: false})
    expect(thinker._doSync.mock.calls).toHaveLength(1)
    doSyncDefer.resolve()
    expect(thinker._doSync.mock.calls).toHaveLength(1)
    expect(doSyncCallback).toBeCalled()
  })

  it('support initOption.autoBackgroundCompletelySync')
})
