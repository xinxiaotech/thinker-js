const lolex = require('lolex')
const Thinker = require('../../index')
const utils = require('../../utils')
const {
  FakeLogger,
  FakeStorage,
} = require('../../../test_helpers')

describe('#do()', () => {
  let clock, thinker, fakeLogger, fireSyncDefer

  beforeEach(() => {
    clock = lolex.install()
    fakeLogger = new FakeLogger
    fireSyncDefer = utils.pending()
    thinker = new Thinker({
      logger: new FakeLogger,
      debounce: 1000 * 5,
    })
    thinker._intoSync = jest.fn(() => fireSyncDefer.promise)
    thinker._changeStatus = jest.fn(Thinker.prototype._changeStatus)
  })

  afterEach(() => {
    clock.uninstall()
  })

  it('reschedule into sync after be called', () => {
    thinker._autoSwitchStatusTimer = 11
    expect(thinker.status).toBe('waiting')
    thinker.do('test #do() 1')
    expect(thinker._autoSwitchStatusTimer).toBe(null)
    const originTimer = thinker._doDebounceTimer
    expect(thinker._intoSync).not.toBeCalled()
    expect(thinker.status).toBe('preparing')
    clock.tick(1000)
    expect(thinker._intoSync).not.toBeCalled()
    expect(thinker.status).toBe('preparing')
    thinker.do('test #do() 2')
    expect(thinker._doDebounceTimer).not.toBe(originTimer)
    expect(thinker._intoSync).not.toBeCalled()
    expect(thinker.status).toBe('preparing')
    clock.tick(4000)
    expect(thinker._intoSync).not.toBeCalled()
    expect(thinker.status).toBe('preparing')
    clock.tick(1000)
    expect(thinker._intoSync).toBeCalled()
  })

  it('update `#_syncCallbacks`, `#_currentSync` if status is undefined, waiting, preparing, blocking, succeed, failed', () => {
    const cb1 = jest.fn()
    const cb2 = jest.fn()
    thinker.do('test #do() 1', null, cb1)
    thinker.do('test #do() 2')
    thinker.do('test #do() 3', {syncAllData: true}, cb2)
    thinker.do('test #do() 4', {syncAllData: true})
    expect(thinker._syncCallbacks[0]).toBe(cb1)
    expect(thinker._syncCallbacks[1]).toBeUndefined()
    expect(thinker._syncCallbacks[2]).toBe(cb2)
    expect(thinker._syncCallbacks[3]).toBeUndefined()
    expect(thinker._currentSync).toEqual([
      {reason: 'test #do() 1', passInOption: null},
      {reason: 'test #do() 2', passInOption: undefined},
      {reason: 'test #do() 3', passInOption: {syncAllData: true}},
      {reason: 'test #do() 4', passInOption: {syncAllData: true}},
    ])
  })

  it('update `#_syncCallbacks`, `#_nextSync` else', () => {
    thinker.status = 'processing'
    const cb1 = jest.fn()
    const cb2 = jest.fn()
    thinker.do('test #do() 1', null, cb1)
    thinker.do('test #do() 2')
    thinker.do('test #do() 3', {syncAllData: true}, cb2)
    thinker.do('test #do() 4', {syncAllData: true})
    expect(thinker._syncCallbacks[0]).toBe(cb1)
    expect(thinker._syncCallbacks[1]).toBeUndefined()
    expect(thinker._syncCallbacks[2]).toBe(cb2)
    expect(thinker._syncCallbacks[3]).toBeUndefined()
    expect(thinker._nextSync).toEqual([
      {reason: 'test #do() 1', passInOption: null},
      {reason: 'test #do() 2', passInOption: undefined},
      {reason: 'test #do() 3', passInOption: {syncAllData: true}},
      {reason: 'test #do() 4', passInOption: {syncAllData: true}},
    ])
  })

  it('support initOption.debounce')

  it('support #do(\'...\', {debounce: ...})')

  it('clean debounce timer before call #_intoSync', () => {
    thinker.do('test #do() 1')
    const originTimer = thinker._doDebounceTimer
    clock.tick(5000)
    expect(thinker._intoSync).toBeCalled()
    expect(thinker._doDebounceTimer).toBe(null)
  })

  it('throw error if reason is not filled', () => {
    expect(() => thinker.do()).toThrowError('[Thinker] reason is required')
  })
})
