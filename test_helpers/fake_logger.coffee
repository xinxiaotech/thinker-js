_ = require 'lodash'

module.exports = class FakeLogger
  @defaultOption = print: false

  constructor: (passInOption) ->
    @option = _.extend {}, FakeLogger.defaultOption, passInOption

    @logs = []
    @errors = []

  log: (messages...) ->
    console.log messages... if @option.print
    @logs.push messages

  error: (messages...) ->
    console.error messages... if @option.print
    @errors.push messages
