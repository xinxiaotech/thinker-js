/**
 * @class SyncFailedError
 * @extends Error
 * @memberof Thinker
 */
export class SyncFailedError extends Error {
  /**
   * @var response {ThinkerType~ResponseInfo}
   * @memberof Thinker.errors.SyncFailedError#
   */
  constructor(response) {
    super(response);

    this.response = response
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = 'SyncFailedError'
    this.message = 'Sync failed'
  }
}


/**
 * @class ResponseEntityEmptyError
 * @extends Error
 * @memberof Thinker
 */
export class ResponseEntityEmptyError extends Error{
  /**
   * @var response {ThinkerType~ResponseInfo}
   * @memberof Thinker.errors.ResponseEntityEmptyError#
   */
  constructor(response) {
    super(response);

    this.response = response
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = 'ResponseEntityEmptyError'
    this.message = 'Response entity is empty'
  }
}

/**
 * @class TimeoutError
 * @extends Error
 * @memberof Thinker
 */
export class TimeoutError extends Error{
  constructor() {
    super();

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = 'TimeoutError'
    this.message = 'timeout'
  }
}