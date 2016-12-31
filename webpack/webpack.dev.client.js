const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const {
  buildPath,
  clientSrcPath,
  clientBuildPath,
  clientUrl,
  publicPath
} = require('./buildConfig')

module.exports = {
  devtool: 'source-map',
  target: 'web',
  entry: {
    main: [
      'react-hot-loader/patch',
      'babel-polyfill',
      `webpack-hot-middleware/client?reload=true&path=${clientUrl}/__webpack_hmr`,
      `${clientSrcPath}/index.js`,
    ],
  },

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/',
    path: clientBuildPath,
    libraryTarget: 'var',
  },

  performance: {
    hints: false
  },

  devServer: {
    hot: true,
    noInfo: true,
    publicPath: publicPath,
    quiet: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
      },
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
          buildPath
        ],
        query: {
          presets: [
           'react-app'
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      eslint: {
        parser: 'babel-eslint',
        extends: 'react-app'
      }
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: buildPath,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    }),
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
}
