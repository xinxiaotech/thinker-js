import _ from 'lodash'

export default class MemoryLogger {
  static defaultOption = {
    print: false,
  }

  constructor(passInOption) {
    this.option = {
      ...this.constructor.defaultOption,
      ...passInOption,
    }

    this.logs = []
    this.errors = []
  }

  log(...messages) {
    if (this.option.print) console.log(...messages)
    this.logs.push(messages)
  }

  error(...messages) {
    if (this.option.print) console.error(...messages)
    this.errors.push(messages)
  }
}
