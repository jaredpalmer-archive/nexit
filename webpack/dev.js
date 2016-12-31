
const path = require('path')
const url = require('url')
const bs = require('browser-sync').create();
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const color = require('cli-color');
const debug = require('./debug');
const serverConfig = require('./webpack.dev.server')
const clientConfig = require('./webpack.dev.client')
const { clientUrl, serverSrcPath } = require('./buildConfig')

const domain = color.magentaBright('webpack');

// Get ports
const port = (parseInt(process.env.PORT, 10) || 3000) - 1;
const proxyPort = port + 1;

// Create compilers
const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);

// Logging
const log = (...args) => debug(domain, ...args);


// Build container
const build = {
  failed: false,
  first: true,
  connections: [],
};

const devMiddleware = webpackDevMiddleware(clientCompiler, {
  publicPath: '/',
  noInfo: true,
  quiet: true,
  stats: {
    timings: false,
    version: false,
    hash: false,
    assets: false,
    chunks: false,
    colors: true,
  },
});

serverCompiler.plugin('done', stats => {

  if (stats.hasErrors()) {
    log(color.red.bold('build failed'));
    build.failed = true;
    return;
  }

  if (build.failed) {
    build.failed = false;
    log(color.green('build fixed'));
  }

  log('built %s in %sms', stats.hash, stats.endTime - stats.startTime);

  const opts = serverCompiler.options;
  const outputPath = path.resolve(opts.output.path, `${Object.keys(opts.entry)[0]}.js`);
  // Make sure our newly built server bundles aren't in the module cache.
  Object.keys(require.cache).forEach((modulePath) => {
    if (modulePath.indexOf(opts.output.path || outputPath) !== -1) {
      delete require.cache[modulePath];
    }
  });

  if (build.listener) {
    // Close the last server listener
    build.listener.close();
  }

  // Start the server
  build.listener = require(outputPath).default; // eslint-disable-line

  // Track all connections to our server so that we can close them when needed.
  build.listener.on('connection', (connection) => {
    // Fixes first request to the server when nothing has been hot reloaded
    if (build.first) {
      devMiddleware.invalidate();
      build.first = false;
    }

    build.connections.push(connection);
    connection.on('close', () => {
      build.connections.splice(build.connections.indexOf(connection));
    });
  });
});

log(`started on ${color.blue.underline(`http://localhost:${proxyPort}`)}`);

serverCompiler.watch({
  aggregateTimeout: 300,
  poll: true,
}, () => undefined);

clientCompiler.watch({
  aggregateTimeout: 300,
  poll: true,
}, () => undefined);

// Initialize BrowserSync
bs.init({
  port: proxyPort,
  open: false,
  notify: false,
  logLevel: 'silent',
  server: {
    baseDir: './',
    middleware: [
      devMiddleware,
      webpackHotMiddleware(clientCompiler, {
        log: () => {}
      }),
      proxyMiddleware(p => !p.match('^/browser-sync'), {
        target: `http://localhost:${port}`,
        changeOrigin: true,
        ws: true,
        logLevel: 'warn',
      }),
    ],
  },
});

process.on('SIGTERM', () => {
  if (build.listener) {
    build.listener.close(() => {
      log('closing %s connections', build.connections.length);
      log('shutting down');
      build.connections.forEach(conn => {
        conn.destroy();
      });
      process.exit(0);
    });
  }
});
