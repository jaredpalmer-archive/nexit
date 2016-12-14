'use strict'

const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const {
  buildPath,
  clientSrcPath,
  clientBuildPath,
  clientUrl,
  serverUrl,
  publicPath
} = require('./buildConfig')

module.exports = {
  devtool: 'source-map',
  entry: {
    main: [
      'babel-polyfill',
      `webpack-hot-middleware/client?reload=true&path=${clientUrl}/__webpack_hmr`,
      `${clientSrcPath}/index.js`,
    ],
    // vendor: [
    //   'react',
    //   'react-dom'
    // ]
  },

  output: {
    filename: '[name].bundle.js',
    publicPath: publicPath,
    path: clientBuildPath,
    chunkFilename: '[name]-[chunkhash].js',
    libraryTarget: 'var',
  },

  devServer: {
    hot: true,
    historyApiFallback: true,
    publicPath: publicPath,
    quiet: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
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
        query: {
          presets: [
           'react-app'
          ],
        },
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: buildPath,
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: Infinity,
    //   filename: 'vendor.bundle.js'
    // }),
    // new webpack.DefinePlugin({
    //   '__DEV__': true
    // }),

    // new webpack.NamedModulesPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here ${serverUrl}`],
        notes: [`Behind the scenes, client-side code is running off of ${clientUrl}`]
      },
    }),
  ]
}
