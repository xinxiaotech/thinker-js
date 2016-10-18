/**
 * @interface Thinker~Logger
 * @memberof Thinker
 */
class Logger {
  /**
   * 打印普通日志
   *
   * @function
   * @name log
   * @param {...*} message
   * @memberof Thinker~Logger#
   */
  log() {
    const message = 1 <= arguments.length ? slice.call(arguments, 0) : []
    return console.log.apply(console, message)
  }

  /**
   * 打印错误日志
   *
   * @function
   * @name error
   * @param {...*} message
   * @memberof Thinker~Logger#
   */
  error() {
    const message = 1 <= arguments.length ? slice.call(arguments, 0) : []
    return console.error.apply(console, message)
  }
}

module.exports = Logger
