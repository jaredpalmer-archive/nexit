import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import App from '../client/App'
import Home from '../client/Home'
import About from '../client/About'

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="about" component={About} />
  </Route>
)

export default routes
