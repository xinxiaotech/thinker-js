import moment from 'moment'
import utils from '../../utils'
import Thinker from '../../'
import MemoryLogger from '../../memory_logger'
import MemoryStorage from '../../memory_storage'
import CONSTS from '../../constants'

describe('#_sendSyncRequest', () => {
  let thinker, fakeStorage, fakeLogger
  let sendRequest, sendRequestCB

  beforeEach(() => {
    fakeStorage = new MemoryStorage
    fakeLogger = new MemoryLogger
    sendRequest = jest.fn((syncInfo, requestInfo, callback) => {
      sendRequestCB = callback
    })
    thinker = new Thinker({
      autoRetryRequestCount: false,
      storage: fakeStorage,
      logger: fakeLogger,
      sendRequest,
    })
  })

  it('build request info for initOption.sendRequest', () => {
    fakeStorage.store[CONSTS.LAST_SYNC_STORAGE_KEY] = Date.now()
    const callback = jest.fn()
    const fakeSyncInfo = {}
    const fakeSyncData = {incremental: {data: true}}
    const fakeRequestConfig = {
      url: 'https://api-ng.pomotodo.com/account/sync',
      method: 'POST',
      data: {
        last_sync: thinker.lastSuccessTime.toJSON(),
        objects: fakeSyncData,
      },
      params: null,
    }
    const fakeResp = {
      config: fakeRequestConfig,
      data: {server: {respond: {data: true}}},
    }

    thinker._sendSyncRequest(fakeSyncInfo, {}, fakeSyncData).then(callback, callback)
    expect(sendRequest).toHaveBeenCalledWith(fakeSyncInfo, fakeRequestConfig, expect.any(Function))
    sendRequestCB(null, fakeResp)
    expect(callback).toHaveBeenCalledWith(fakeResp)
    expect(fakeLogger.logs).toEqual([['[Thinker] request retry(1)', fakeRequestConfig]])
  })

  it('can handle option.syncAllData', () => {
    const fakeSyncInfo = {}
    const fakeSyncData = {all: {data: true}}
    thinker._sendSyncRequest(fakeSyncInfo, { syncAllData: true }, fakeSyncData)
    expect(sendRequest).toHaveBeenCalledWith(fakeSyncInfo, {
      url: 'https://api-ng.pomotodo.com/account/sync',
      method: 'POST',
      data: { objects: fakeSyncData },
      params: null,
    }, expect.any(Function))
  })

  it('exec fast sync if never synced', () => {
    const fakeSyncInfo = {}
    const fastFromRegexp = RegExp('^' + moment().subtract(31, 'd').toJSON().replace(/\.\d+Z?$/, ''))
    thinker._sendSyncRequest(fakeSyncInfo, {}, null)
    expect(sendRequest).toHaveBeenCalledWith(fakeSyncInfo, {
      url: 'https://api-ng.pomotodo.com/account/sync',
      method: 'POST',
      data: {
        fast_from: expect.stringMatching(fastFromRegexp),
        objects: {},
      },
      params: null,
    }, expect.any(Function))
  })

  it('throw ResponseEntityEmptyError if server did not respond data', () => {
    const callback = jest.fn()
    thinker._sendSyncRequest({}, {}, null).then(callback, callback)

    const fakeResp = {
      config: sendRequest.mock.calls[0][1],
      data: null,
    }
    sendRequestCB(null, fakeResp)
    expect(callback).toHaveBeenCalledWith(expect.any(Thinker.ResponseEntityEmptyError))
    expect(callback.mock.calls[0][0].response).toEqual(fakeResp)
  })

  it('throw SyncFailedError if status code not valid', () => {
    const callback = jest.fn()
    thinker._sendSyncRequest({}, {}, null).then(callback, callback)

    const fakeResp = {
      config: sendRequest.mock.calls[0][1],
      data: null,
      status: 503,
    }
    sendRequestCB(null, fakeResp)
    expect(callback).toHaveBeenCalledWith(expect.any(Thinker.SyncFailedError))
    expect(callback.mock.calls[0][0].response).toEqual(fakeResp)
  })

  it('can handle errors from initOption.sendRequest', () => {
    const callback = jest.fn()
    const fakeError = new Error
    thinker._sendSyncRequest({}, {}, null).then(callback, callback)
    sendRequestCB(fakeError)
    expect(callback).toHaveBeenCalledWith(fakeError)
    expect(fakeLogger.errors).toEqual([['[Thinker] request failed(1)', fakeError]])
  })

  it('support auto retry sync request', () => {
    const orignDelayRetry = utils.delayRetry
    utils.delayRetry = jest.fn(orignDelayRetry)
    thinker.initOption.autoRetryRequestCount = 10
    thinker._sendSyncRequest({}, {}, null)
    expect(utils.delayRetry).toHaveBeenCalledWith(
      expect.any(Function),
      {maxRetryCount: 10},
    )
    utils.delayRetry = orignDelayRetry
  })
})
