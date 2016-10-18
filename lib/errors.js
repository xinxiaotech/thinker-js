/**
 * @class SyncFailedError
 * @extends Error
 * @memberof Thinker
 */
class SyncFailedError {
  /**
   * @var response {ThinkerType~ResponseInfo}
   * @memberof Thinker.errors.SyncFailedError#
   */
  constructor(response) {
    this.response = response
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = 'SyncFailedError'
    this.message = 'Sync failed'
  }
}
SyncFailedError.prototype = Object.create(Error.prototype)
SyncFailedError.prototype.constructor = SyncFailedError


/**
 * @class SyncBeCanceledError
 * @extends Error
 * @memberof Thinker
 */
class SyncBeCanceledError {
  /**
   * @var response {ThinkerType~ResponseInfo}
   * @memberof Thinker.errors.SyncBeCanceledError#
   */
  constructor(response) {
    this.response = response
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = 'SyncBeCanceledError'
    this.message = 'Sync failed'
  }
}
SyncBeCanceledError.prototype = Object.create(Error.prototype)
SyncBeCanceledError.prototype.constructor = SyncBeCanceledError


/**
 * @class ResponseEntityEmptyError
 * @extends Error
 * @memberof Thinker
 */
class ResponseEntityEmptyError {
  /**
   * @var response {ThinkerType~ResponseInfo}
   * @memberof Thinker.errors.ResponseEntityEmptyError#
   */
  constructor(response) {
    this.response = response
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = 'ResponseEntityEmptyError'
    this.message = 'Response entity is empty'
  }
}
ResponseEntityEmptyError.prototype = Object.create(Error.prototype)
ResponseEntityEmptyError.prototype.constructor = ResponseEntityEmptyError

module.exports = {
  SyncFailedError,
  SyncBeCanceledError,
  ResponseEntityEmptyError,
}
