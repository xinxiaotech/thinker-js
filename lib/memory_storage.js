class MemoryStorage {
  constructor() {
    this.store = {}
  }

  get length() {
    return Object.keys(this.store).length
  }

  key(index) {
    return Object.keys(this.store)[index]
  }

  getItem(key) {
    return this.store[key]
  }

  setItem(key, value) {
    this.store[key] = value
  }

  removeItem(key) {
    delete this.store[key]
  }

  clear() {
    this.store = {}
  }
}

module.exports = MemoryStorage
