const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')

const config = {
  mode: 'production',
  context: path.resolve('.'),
  entry: ['./lib/index.js'],
  resolveLoader: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules",
    ],
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: {
        test: path.resolve(__dirname, 'node_modules'),
        exclude: [
          path.resolve(__dirname, 'node_modules/lodash-es'),
        ],
      },
      use: 'babel-loader',
    }]
  },
  output: {
    path: path.resolve('./dist'),
    publicPath: '/',
    filename: '[name].js',
    library: 'Thinker',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  devtool: 'source-map',
}

module.exports = config
