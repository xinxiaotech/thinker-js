const _ = require('lodash')
const sysPath = require('path')
const webpack = require('webpack')

config = {
  context: sysPath.resolve('.'),
  entry: ['./lib/index.js'],
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
    }]
  },
  output: {
    path: sysPath.resolve('./dist'),
    publicPath: '/',
    filename: '[name].js',
    library: 'thinkerjs'
  },
  externals: {
    'lodash': '_'
  },
  devtool: 'source-map'
}

module.exports = config
