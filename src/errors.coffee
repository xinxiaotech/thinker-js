
###*
# @class SyncFailedError
# @extends Error
# @memberof Thinker
###
class SyncFailedError
  ###*
  # @var response {ThinkerType~ResponseInfo}
  # @memberof Thinker.errors.SyncFailedError#
  ###

  constructor: (@response) ->
    Error.captureStackTrace?(this, @constructor)
    @name = 'SyncFailedError'
    @message = 'Sync failed'
SyncFailedError.prototype = Object.create(Error.prototype)
SyncFailedError.prototype.constructor = SyncFailedError

###*
# @class SyncBeCanceledError
# @extends Error
# @memberof Thinker
###
class SyncBeCanceledError
  ###*
  # @var response {ThinkerType~ResponseInfo}
  # @memberof Thinker.errors.SyncBeCanceledError#
  ###

  constructor: (@response) ->
    Error.captureStackTrace?(this, @constructor)
    @name = 'SyncBeCanceledError'
    @message = 'Sync failed'
SyncBeCanceledError.prototype = Object.create(Error.prototype)
SyncBeCanceledError.prototype.constructor = SyncBeCanceledError

###*
# @class ResponseEntityEmptyError
# @extends Error
# @memberof Thinker
###
class ResponseEntityEmptyError
  ###*
  # @var response {ThinkerType~ResponseInfo}
  # @memberof Thinker.errors.ResponseEntityEmptyError#
  ###

  constructor: (@response) ->
    Error.captureStackTrace?(this, @constructor)
    @name = 'ResponseEntityEmptyError'
    @message = 'Response entity is empty'
ResponseEntityEmptyError.prototype = Object.create(Error.prototype)
ResponseEntityEmptyError.prototype.constructor = ResponseEntityEmptyError

module.exports = {
  SyncFailedError
  SyncBeCanceledError
  ResponseEntityEmptyError
}
