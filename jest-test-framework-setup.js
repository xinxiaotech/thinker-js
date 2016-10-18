process.env.NODE_ENV = 'test'

Promise = require('bluebird')
Promise.setScheduler((fn) => fn())
