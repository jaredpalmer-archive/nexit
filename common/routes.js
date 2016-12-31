import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import App from './App'

const importHome = function (nextState, cb) {
  System.import('./Home')
    .then(function(module) {
      cb(null, module.default)
    })
    .catch(function(e) {
      throw e;
    });
};

const importAbout = function (nextState, cb) {
  System.import('./About')
    .then(function(module) {
      cb(null, module.default)
    })
    .catch(function(e) {
      throw e;
    });
};

// We use `getComponent` to dynamically load routes.
// https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
const routes = (
  <Route path="/" component={App}>
    <IndexRoute getComponent={importHome} />
    <Route path="about" getComponent={importAbout} />
  </Route>
);

// Unfortunately, HMR breaks when we dynamically resolve
// routes so we need to require them here as a workaround.
// https://github.com/gaearon/react-hot-loader/issues/288
if (module.hot) {
  require('./Home');    // eslint-disable-line global-require
  require('./About');   // eslint-disable-line global-require
}

export default routes;

