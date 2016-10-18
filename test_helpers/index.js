const _ = require('lodash')

module.exports = {
  FakeLogger: require('./fake_logger'),
  FakeStorage: require('./fake_storage'),
  regThinkerEvents(thinker) {
    const eventFns = {
      waiting: jest.fn(),
      preparing: jest.fn(),
      blocking: jest.fn(),
      processing: jest.fn(),
      succeed: jest.fn(),
      failed: jest.fn(),
    }
    _.forEach(eventFns, (fn, eventName) => {
      thinker.on(eventName, fn)
    })
    return eventFns
  },
}
