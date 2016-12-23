'use strict'

const path = require('path')
const rootPath = path.resolve(process.cwd())
const buildPath = path.join(rootPath, 'build')

module.exports = {
  rootPath,
  buildPath,
  clientSrcPath: path.join(rootPath, 'client'),
  clientBuildPath: path.join(buildPath, 'client'),
  serverSrcPath: path.join(rootPath, 'server'),
  serverBuildPath: path.join(buildPath, 'server'),
  publicSrcPath: path.join(rootPath, 'public'),
  publicBuildPath: path.join(buildPath, 'public'),
  publicPath: '/',
  clientUrl: 'http://localhost:3001',
  serverUrl: 'http://localhost:3000'
}
