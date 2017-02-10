import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router/lib/Router'
import browserHistory from 'react-router/lib/browserHistory'
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware'
import useScroll from 'react-router-scroll/lib/useScroll'
import match from 'react-router/lib/match'
import { ComponentData } from '../lib/ComponentData'
import routes from '../common/routes'

// Render the application
const render = (target = 'root') => {
  match({
    routes: (<Router>{routes}</Router>),
    location: window.location,
  }, (err, location, props) => {

    // Make sure that all System.imports are loaded before rendering
    const imports = props.routes
      .filter(route => route.getComponent)
      .map(route => new Promise(resolve => route.getComponent(location, resolve)))

    // Run the chain
    Promise.all(imports)
      .then(() => {
        ReactDOM.render(
          <ComponentData data={window._initialState || null}>
            <Router
              history={browserHistory}
              render={applyRouterMiddleware(useScroll())}
            >
              {props.routes}
            </Router>
          </ComponentData>,
          document.getElementById(target)
        )

        delete window._initialState
      })
  })
}

// Render for the first time
render()

if (module.hot) {
  // Remove some warnings and errors related to
  // hot reloading and System.import conflicts.
  require('../common/utils/hmr') // eslint-disable-line
  module.hot.accept(() => render())
}
