/**
 * @class SyncFailedError
 * @extends Error
 * @memberof Thinker
 */
export class SyncFailedError {
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
 * @class ResponseEntityEmptyError
 * @extends Error
 * @memberof Thinker
 */
export class ResponseEntityEmptyError {
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

/**
 * @class TimeoutError
 * @extends Error
 * @memberof Thinker
 */
export class TimeoutError {
  constructor() {
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = 'TimeoutError'
    this.message = 'timeout'
  }
}
TimeoutError.prototype = Object.create(Error.prototype)
TimeoutError.prototype.constructor = TimeoutError