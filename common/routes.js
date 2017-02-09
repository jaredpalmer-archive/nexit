/* global __DEV__ __CLIENT__ */
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import loadRoute from './loadRoute'
import App from './App'

// We use `getComponent` to dynamically load routes.
// @see https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
const routes = (
  <Route path='/' component={App}>
    <IndexRoute getComponent={loadRoute('Home')} />
    <Route path='about' getComponent={loadRoute('About')} />
    <Route path='detail/:id' getComponent={loadRoute('Detail')} />
  </Route>
)

// Hot Module Replacement breaks when we dynamically
// resolve routes so we globally require them here as a workaround.
// @see https://github.com/gaearon/react-hot-loader/issues/288
if (module.hot && __CLIENT__ &&  __DEV__) {
  require('./Home')    // eslint-disable-line global-require
  require('./About')   // eslint-disable-line global-require
}

export default routes

