module.exports = {
  "plugins": [
    ["transform-class-properties"],
    ["transform-object-rest-spread"],
    ["transform-strict-mode", {
      "strict": true
    }]
  ],
  "presets": [["env", { modules: process.env.NODE_ENV !== 'test' ? false : 'commonjs' }]]
}
