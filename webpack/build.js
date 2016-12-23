const path = require('path');
const webpack = require('webpack');
const serverConfig = require('./webpack.prod.server')
const clientConfig = require('./webpack.prod.client')

const clientCompiler = webpack(clientConfig, (err, stats) => {
   if (err) {
    console.log(err)
    return;
  }
  buildServer();
})

const buildServer = () => {
  const serverCompiler = webpack(serverConfig, (err, stats) => {
    if (err) {
      console.log(err)
      return;
    }
  })
  serverCompiler.run(() => undefined);
}

clientCompiler.run(() => undefined);
