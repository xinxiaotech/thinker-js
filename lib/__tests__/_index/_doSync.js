import moment from 'moment'
import Thinker from '../../'
import utils from '../../utils'
import MemoryLogger from '../../memory_logger'
import MemoryStorage from '../../memory_storage'
import CONSTS from '../../constants'

const ignoreLittleTimeDelay = time =>
  Math.ceil(new Date(time).getTime() / 100)

describe('#_doSync()', () => {
  let thinker, sendSyncRequestDefer, updateLocalDataDefer, fakeStorage
  let getDataToSync, getDataToSyncCB
  let getAllDataToSync, getAllDataToSyncCB

  beforeEach(() => {
    getDataToSync = jest.fn((syncInfo, cb) => getDataToSyncCB = cb)
    getAllDataToSync = jest.fn((syncInfo, cb) => getAllDataToSyncCB = cb)
    fakeStorage = new MemoryStorage
    thinker = new Thinker({
      storage: fakeStorage,
      logger: new MemoryLogger,
      getDataToSync: getDataToSync,
      getAllDataToSync: getAllDataToSync,
    })
    thinker._doSync = jest.fn(thinker._doSync)
    thinker._sendSyncRequest = jest.fn(() => {
      sendSyncRequestDefer = utils.pending()
      return sendSyncRequestDefer.promise
    })
    thinker._updateLocalData = jest.fn(() => {
      updateLocalDataDefer = utils.pending()
      return updateLocalDataDefer.promise
    })
  })

  it('query data', () => {
    const fakeSyncInfo = {}
    thinker._doSync(fakeSyncInfo, {syncAllData: false})
    expect(getDataToSync).toBeCalledWith(fakeSyncInfo, expect.any(Function))
    thinker._doSync(fakeSyncInfo, {syncAllData: true})
    expect(getAllDataToSync).toBeCalledWith(fakeSyncInfo, expect.any(Function))
  })

  it('send sync request and update local data', () => {
    const fakeSyncInfo = {}
    const fakeRequestData = {}
    const fakeRequestResp = {}

    thinker._doSync(fakeSyncInfo, {syncAllData: false})
    getDataToSyncCB(null, fakeRequestData)
    expect(thinker._sendSyncRequest).toBeCalledWith(fakeSyncInfo, {syncAllData: false}, fakeRequestData)
    sendSyncRequestDefer.resolve(fakeRequestResp)
    expect(thinker._updateLocalData).toBeCalledWith(fakeSyncInfo, fakeRequestResp)
  })

  it('update last sync info', () => {
    const lastSyncTime = moment().format()
    const doSyncCallback = jest.fn()

    // normal case
    thinker._doSync({passInOptions: []}, {syncAllData: false}).then(doSyncCallback, doSyncCallback)
    getDataToSyncCB(null, {})
    sendSyncRequestDefer.resolve({})
    updateLocalDataDefer.resolve({data: {last_sync: lastSyncTime}})
    expect(fakeStorage.store).toEqual({
      [CONSTS.LAST_SYNC_STORAGE_KEY]: moment(lastSyncTime).valueOf(),
    })
    expect(doSyncCallback.mock.calls).toHaveLength(1)
    expect(doSyncCallback).lastCalledWith(undefined)

    // error case
    let error, faildTime

    fakeStorage.store = {}
    error = new Error
    thinker._doSync({passInOptions: []}, {syncAllData: false}).then(doSyncCallback, doSyncCallback)
    getDataToSyncCB(error)
    faildTime = fakeStorage.store[CONSTS.LAST_SYNC_FAIL_STORAGE_KEY]
    expect(ignoreLittleTimeDelay(faildTime)).toEqual(ignoreLittleTimeDelay(Date.now()))
    expect(doSyncCallback.mock.calls).toHaveLength(2)
    expect(doSyncCallback).lastCalledWith(error)

    fakeStorage.store = {}
    error = new Error
    thinker._doSync({passInOptions: []}, {syncAllData: false}).then(doSyncCallback, doSyncCallback)
    getDataToSyncCB(null, {})
    sendSyncRequestDefer.reject(error)
    faildTime = fakeStorage.store[CONSTS.LAST_SYNC_FAIL_STORAGE_KEY]
    expect(ignoreLittleTimeDelay(faildTime)).toEqual(ignoreLittleTimeDelay(Date.now()))
    expect(doSyncCallback.mock.calls).toHaveLength(3)
    expect(doSyncCallback).lastCalledWith(error)

    fakeStorage.store = {}
    error = new Error
    thinker._doSync({passInOptions: []}, {syncAllData: false}).then(doSyncCallback, doSyncCallback)
    getDataToSyncCB(null, {})
    sendSyncRequestDefer.resolve({})
    updateLocalDataDefer.reject(error)
    faildTime = fakeStorage.store[CONSTS.LAST_SYNC_FAIL_STORAGE_KEY]
    expect(ignoreLittleTimeDelay(faildTime)).toEqual(ignoreLittleTimeDelay(Date.now()))
    expect(doSyncCallback.mock.calls).toHaveLength(4)
    expect(doSyncCallback).lastCalledWith(error)
  })

  it('try to trigger background initialize completely sync', () => {
    const fakeSyncInfo = {}
    const fakeOption = {syncAllData: false}
    const doSyncCallback = jest.fn()
    thinker._tryToTriggerBackgroundInitializeCompletelySync = jest.fn(() => utils.pending().promise)
    thinker._doSync(fakeSyncInfo, fakeOption).then(doSyncCallback, doSyncCallback)
    getDataToSyncCB(null, {})
    sendSyncRequestDefer.resolve({})
    updateLocalDataDefer.resolve({data: {last_sync: moment().format()}})
    expect(thinker._tryToTriggerBackgroundInitializeCompletelySync).toBeCalledWith(fakeSyncInfo, fakeOption)
    expect(doSyncCallback).toBeCalled()
  })
})
