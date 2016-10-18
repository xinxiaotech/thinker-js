const coffee = require('coffee-script')
const babelJest = require('babel-jest')
const fs = require('fs')

const babelConfig = JSON.parse(fs.readFileSync('./.babelrc'))

module.exports = {
  canInstrument: true,
  process(src, filename, config, preprocessorOptions) {
    if (coffee.helpers.isCoffee(filename)) {
      return coffee.compile(src, {bare: true})
    } else if (/\.(sass|scss|css)$/.test(filename)) {
      return ''
    } else {
      return babelJest.createTransformer(babelConfig).process(src, filename, config, preprocessorOptions)
    }
  }
}
