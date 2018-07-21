export default class MemoryStorage {
  constructor() /* istanbul ignore next */ {
    this.store = {}
  }

  get length() /* istanbul ignore next */ {
    return Object.keys(this.store).length
  }

  key(index) /* istanbul ignore next */ {
    return Object.keys(this.store)[index]
  }

  getItem(key) /* istanbul ignore next */ {
    return this.store[key]
  }

  setItem(key, value) /* istanbul ignore next */ {
    this.store[key] = value
  }

  removeItem(key) /* istanbul ignore next */ {
    delete this.store[key]
  }

  clear() /* istanbul ignore next */ {
    this.store = {}
  }
}
