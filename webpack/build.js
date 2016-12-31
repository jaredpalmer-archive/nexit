'use strict'

const path = require('path');
const webpack = require('webpack');
const serverConfig = require('./webpack.prod.server')
const clientConfig = require('./webpack.prod.client')

let serverCompiler

const clientCompiler = webpack(clientConfig, (err, stats) => {
   if (err) {
    console.error(err)
    process.exit(1)
  }
  buildServer();
})

const buildServer = () => {
  serverCompiler = webpack(serverConfig, (err, stats) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
  serverCompiler.run(() => undefined);
}

clientCompiler.run(() => undefined);
