const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')

config = {
  context: path.resolve('.'),
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
      exclude: [path.resolve(__dirname, 'node_modules')],
      loader: 'babel',
    }]
  },
  output: {
    path: path.resolve('./dist'),
    publicPath: '/',
    filename: '[name].js',
    library: 'Thinker',
    libraryTarget: 'umd'
  },
  externals: (context, request, callback) => {
    if (/^lodash\//.test(request)) {
      callback(null, {
        commonjs2: request,
        commonjs: request,
        amd: request,
        root: ['_', request.replace(/^lodash\//, '')]
      })
    } else {
      callback()
    }
  },
  devtool: 'source-map'
}

module.exports = config
