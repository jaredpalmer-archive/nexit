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
  externals: nodeExternals({
    // ignore these file types
    whitelist: [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|less|styl)$/,
    ],
  }),
  performance: {
    hints: false
  },
  node: {
    __filename: true,
    __dirname: true
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
    sourceMapFilename: '[name].map',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: publicPath,
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
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
           ["latest", { "es2015": { "modules": false  } }],
           'react-app'
          ],
        },
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true,
      '__CLIENT__': false,
      '__SERVER__': true
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.BannerPlugin({
      raw: true,
      banner: 'require("source-map-support").install();',
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
