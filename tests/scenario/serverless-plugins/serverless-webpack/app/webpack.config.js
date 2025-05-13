"use strict"

const { lib } = require("serverless-webpack")

module.exports = {
  devtool: "source-map",
  entry: lib.entries,
  mode: "development",
  module: {
    rules: [
      {
        loader: "ts-loader",
        test: /\.tsx?$/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  target: "node",
}
