'use strict'

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const {
  buildPath,
  serverSrcPath,
  serverBuildPath,
  publicPath
} = require('./buildConfig')

module.exports = {
  target: 'node',
  devtool: 'source-map',
  externals: [nodeExternals()],
  node: {
    __filename: false,
    __dirname: false
  },
  entry: {
    main: [
      'babel-polyfill',
      `${serverSrcPath}/index.js`
    ],
  },
  output: {
    path: serverBuildPath,
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: publicPath,
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          buildPath,
        ],
        options: {
          presets: [
            ["latest", { "es2015": { "modules": false  } }],
           'react-app'
          ],
        },
      },
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: '/',
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false
    })
  ]
}
