'use strict'

const { resolve } = require('path')
const { lib } = require('serverless-webpack')

module.exports = {
  devtool: 'source-map',
  entry: lib.entries,
  mode: 'development',
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.tsx?$/,
      },
    ],
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  target: 'node',
}
