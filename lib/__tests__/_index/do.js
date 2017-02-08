const lolex = require('lolex')
const Thinker = require('../../index')
const utils = require('../../utils')
const {
  regThinkerEvents,
  FakeLogger,
  FakeStorage,
} = require('../../../test_helpers')

describe('#do()', () => {
  let clock, thinker, fireSyncDefer

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

    thinker._fireSync = jest.fn(() => {
      fireSyncDefer = utils.pending()
      return fireSyncDefer.promise
    })
  })

  it('reschedule fire sync after be called', () => {
    expect(thinker.status).toBe('waiting')
    thinker.do('test #do() 1')
    const originTimer = thinker._doDebounceTimer
    expect(thinker._fireSync).not.toBeCalled()
    clock.tick(1000)
    expect(thinker._fireSync).not.toBeCalled()
    thinker.do('test #do() 2')
    expect(thinker._doDebounceTimer).not.toBe(originTimer)
    expect(thinker._fireSync).not.toBeCalled()
    clock.tick(4000)
    expect(thinker._fireSync).not.toBeCalled()
    clock.tick(1000)
    expect(thinker._fireSync).toBeCalled()
  })

  it('add callback to `this._syncCallbacks` and add reason, option to `this._currentSync`', () => {
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

  it('schedule next sync if status is `processing`', () => {
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

  it('fire event `preparing` immediately', () => {
    const eventFns = regThinkerEvents(thinker)
    expect(eventFns.preparing).not.toBeCalled()
    thinker.do('test #do() fire event')
    expect(eventFns.preparing).toBeCalled()
  })

  it('throw error if reason is not filled', () => {
    expect(() => thinker.do()).toThrowError('[Thinker] reason is required')
  })
})
