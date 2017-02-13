/**
 * @interface Thinker~Logger
 * @memberof Thinker
 */
export default class MemoryLogger {
  static defaultOption = {
    print: process.env.NODE_ENV === 'test' ? false : true,
  }

  /* istanbul ignore next */
  constructor(passInOption) {
    this.option = {
      ...this.constructor.defaultOption,
      ...passInOption,
    }

    this.logs = []
    this.errors = []
  }

  /**
   * 打印普通日志
   *
   * @function
   * @name log
   * @param {...*} message
   * @memberof Thinker~Logger#
   */
  log(...messages) /* istanbul ignore next */ {
    if (this.option.print) console.log(...messages)
    this.logs.push(messages)
  }

  /**
   * 打印错误日志
   *
   * @function
   * @name error
   * @param {...*} message
   * @memberof Thinker~Logger#
   */
  error(...messages) /* istanbul ignore next */ {
    if (this.option.print) console.error(...messages)
    this.errors.push(messages)
  }
}
