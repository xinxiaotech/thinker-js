const _ = require('lodash')
const lolex = require('lolex')
const Thinker = require('../index')
const FakeLogger = require('../../test_helpers/fake_logger')
const FakeStorage = require('../../test_helpers/fake_storage')

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

  describe('#do()', () => {
    let thinker

    beforeEach(() => {
      thinker = new Thinker({
        logger: new FakeLogger,
        storage: new FakeStorage,
        debounceWait: 1000 * 5,
      })
    })

    it('reschedule fire sync after be called', function() {
      thinker._fireSync = jest.fn(() => Promise.defer().promise)
      thinker.do('test #do() 1')
      expect(thinker._fireSync).not.toBeCalled()
      clock.tick(1000)
      expect(thinker._fireSync).not.toBeCalled()
      thinker.do('test #do() 2')
      expect(thinker._fireSync).not.toBeCalled()
      clock.tick(4000)
      expect(thinker._fireSync).not.toBeCalled()
      clock.tick(1000)
      expect(thinker._fireSync).toBeCalled()
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
