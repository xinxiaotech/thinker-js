
module.exports = class FakeStorage
  constructor: ->
    @store = {}

  key: (n) ->
    _.keys(@store)[n]

  getItem: (k) ->
    @store[k]

  setItem: (k, v) ->
    @store[k] = v

  removeItem: (k) ->
    delete @store[k]

  clear: ->
    @store = {}
