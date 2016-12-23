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
  nodemon({ script: mainPath, watch: serverPaths })
    .once('start', () => {
      // console.log(`Server running at: ${'http://localhost:3000'}`);
      // console.log('Development started');
    })
    .on('restart', () => console.log('Development server restarted'))
    .on('quit', process.exit);
};

const clientCompiler = webpack(clientConfig, (err, stats) => {
   if (err) {
    console.log(err)
    return;
  }
  compileServer();
})


const startClient = () => {
  const devOptions = clientCompiler.options.devServer;
  const app = express();
  const webpackDevMiddleware = devMiddleware(clientCompiler, devOptions);
  app.use(webpackDevMiddleware);
  app.use(hotMiddleware(clientCompiler, {
    log: () => {},
    path: '/__webpack_hmr'
  }));
  app.listen(url.parse(clientUrl).port);
};

const serverCompiler = webpack(serverConfig, (err, stats) => {
  if (err) {
    console.log(err)
    return;
  }
  startServerOnce();
})

const compileServer = () => serverCompiler.run(() => undefined);



const startServerOnce = once(() => startServer())

const watcher = chokidar.watch([serverSrcPath, path.join(__dirname, '../common')]);

watcher.on('ready', () => {
  watcher
    .on('add', compileServer)
    .on('addDir', compileServer)
    .on('change', compileServer)
    .on('unlink', compileServer)
    .on('unlinkDir', compileServer);
});

startClient()
