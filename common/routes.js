/* global __DEV__ */
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'

// Neither System.import nor require.ensure allow dynamic
// import statements without a babel-plugin. SO you CANNOT write
// something like this:
//
// ```
// const dynImport = (path) => (nextState, cb) => {
//  System.import(path)
//    .then(module => cb(null, module.default))
//    .catch(e => { throw e })
//  }
// ```
//
// Luckily, @airbnb has a solution if you are crazy about staying DRY
// @see https://github.com/airbnb/babel-plugin-dynamic-import-webpack

// Lazy load a Home route
const importHome = (nextState, cb) => {
  System.import('./Home')
    .then(module => cb(null, module.default))
    .catch(e => { throw e })
}

// Lazy load a About route
const importAbout = (nextState, cb) => {
  System.import('./About')
    .then(module => cb(null, module.default))
    .catch(e => { throw e })
}

// We use `getComponent` to dynamically load routes.
// @see https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
const routes = (
  <Route path='/' component={App}>
    <IndexRoute getComponent={importHome} />
    <Route path='about' getComponent={importAbout} />
  </Route>
)

// Hot Module Replacement breaks when we dynamically
// resolve routes so we globally require them here as a workaround.
// @see https://github.com/gaearon/react-hot-loader/issues/288
if (module.hot && __DEV__) {
  require('./Home')    // eslint-disable-line global-require
  require('./About')   // eslint-disable-line global-require
}

export default routes

