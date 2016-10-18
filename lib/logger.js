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
  log(...args) {
    return console.log(...args)
  }

  /**
   * 打印错误日志
   *
   * @function
   * @name error
   * @param {...*} message
   * @memberof Thinker~Logger#
   */
  error(...args) {
    return console.log(...args)
  }
}

module.exports = Logger
