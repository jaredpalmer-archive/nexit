const nodemon = require('nodemon')
const path = require('path');
const chokidar = require('chokidar');
const express = require('express');
const webpack = require('webpack');
const url = require('url')
const once = require('ramda').once
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const serverConfig = require('./webpack.dev.server')
const clientConfig = require('./webpack.dev.client')
const { clientUrl, serverSrcPath, buildPath } = require('./buildConfig')

process.on('SIGINT', process.exit);

const startServer = () => {
  const serverPaths = Object
    .keys(serverCompiler.options.entry)
    .map(entry => path.join(serverCompiler.options.output.path, `${entry}.js`));
  const mainPath = path.join(serverCompiler.options.output.path, 'main.js');
  nodemon({ script: mainPath, watch: serverPaths, flags: [] })
    .once('start', () => {
      //console.log(`NODEMON: Server running at: ${'http://localhost:3000'}`);
      //console.log('NODEMON: Development started');
    })
    // .on('restart', () => console.log('Server restarted'))
    .on('quit', process.exit);
};

const afterClientCompile = once(() => {
  // console.log('[WEBPACK-CLIENT]: Setup RHL')
  // console.log('[WEBPACK-CLIENT]: Done compiling client')
})

clientCompiler = webpack(clientConfig, (err, stats) => {
  if (err) process.exit(1)
  afterClientCompile();
  compileServer();
})

const startClient = () => {
  const devOptions = clientCompiler.options.devServer;
  const app = express();
  const webpackDevMiddleware = devMiddleware(clientCompiler, devOptions);
  app.use(webpackDevMiddleware);
  app.use(hotMiddleware(clientCompiler, {
    log: () => {}
  }))
  app.listen(url.parse(clientUrl).port);
  // console.log('[WEBPACK-CLIENT]: Started asset server on http://localhost:' + url.parse(clientUrl).port)
};

const compileServer = () => serverCompiler.run(() => undefined);

const startServerOnce = once(startServer)

const watcher = chokidar.watch([serverSrcPath]);

watcher.on('ready', () => {
  watcher
    .on('add', compileServer)
    .on('addDir', compileServer)
    .on('change', compileServer)
    .on('unlink', compileServer)
    .on('unlinkDir', compileServer);
});

const serverCompiler = webpack(serverConfig, (err, stats) => {
  if (err) process.exit(1)
  else {
    startServerOnce();
  }
});

startClient()
