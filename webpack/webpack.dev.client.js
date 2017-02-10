const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const {
  buildPath,
  clientSrcPath,
  clientBuildPath,
  publicPath
} = require('./buildConfig')


const port = (parseInt(process.env.PORT, 10) || 3000) - 1;
const proxyPort = port + 1;

module.exports = {
  devtool: 'source-map',
  target: 'web',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-helmet',
    ],
    main: [
      'react-hot-loader/patch',
      `webpack-hot-middleware/client?reload=true&path=http://localhost:${proxyPort}/__webpack_hmr`,
      'babel-polyfill',
      `${clientSrcPath}/index.js`,
    ],
  },

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name]-[chunkhash].js',
    sourceMapFilename: '[name].map',
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
          ],
          plugins: [
            'react-hot-loader/babel'
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      eslint: {
        parser: 'babel-eslint',
        extends: 'react-app'
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.js',
    }),
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: buildPath,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true,
      '__CLIENT__': true,
      '__SERVER__': false
    }),
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
