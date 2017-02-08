const _ = require('lodash')
const lolex = require('lolex')
const Thinker = require('../index')
const utils = require('../utils')
const {
  regThinkerEvents,
  FakeLogger,
  FakeStorage,
} = require('../../test_helpers')

Thinker.prototype._doSync = jest.fn(() => {
  return utils.pending().promise
})

describe('Thinker', function() {
  let clock

  beforeEach(() => {
    clock = lolex.install()
  })
  afterEach(() => {
    clock.uninstall()
  })

  require('./_index/do.js')
  require('./_index/_intoSync.js')
  require('./_index/_callSync.js')
  require('./_index/waitUntilCanSync.js')

  describe('#_doSync()', () => {
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
})
