const { merge } = require('webpack-merge')

const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'development',

  devServer: {
    writeToDisk: true
  },
  devtool: 'inline-source-map'
})
