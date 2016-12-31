'use strict'

const path = require('path')
const rootPath = path.resolve(process.cwd())
const buildPath = path.join(rootPath, 'build')
const publicBuildPath = path.join(buildPath, 'public')

module.exports = {
  rootPath,
  buildPath,
  publicBuildPath,
  publicSrcPath: path.join(rootPath, 'public'),
  clientSrcPath: path.join(rootPath, 'client'),
  clientBuildPath: path.join(buildPath, 'client'),
  assetsBuildPath: path.join(publicBuildPath, '/'),
  serverSrcPath: path.join(rootPath, 'server'),
  serverBuildPath: path.join(buildPath, 'server'),
  publicSrcPath: path.join(rootPath, 'public'),
  publicBuildPath: path.join(buildPath, 'public'),
  publicPath: '/',
  clientUrl: 'http://localhost:3001',
  serverUrl: 'http://localhost:3000'
}
