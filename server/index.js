/* global __DEV__ */
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import hpp from 'hpp'

import React from 'react'
import ReactDOM from 'react-dom/server'
import ReactHelmet from 'react-helmet'
import RouterContext from 'react-router/lib/RouterContext'
import createMemoryHistory from 'react-router/lib/createMemoryHistory'
import match from 'react-router/lib/match'

import routes from '../common/routes'
const assets = require('../build/assets.json')
const assetUrl = __DEV__ ? 'http://localhost:3001' : ''

const app = express()


// Hide all software information
app.disable('x-powered-by')

// Prevent HTTP Parameter pollution.
// @note: Make sure body parser goes above the hpp middleware
app.use(hpp())

// Content Security Policy
const csp = {
  directives: {
    defaultSrc: ["'self'"],
    // external scripts here...
    scriptSrc: ["'self' 'unsafe-inline' 'unsafe-eval'", 'cdn.polyfill.io'],
    styleSrc: ["'self' 'unsafe-inline'", 'fonts.googleapis.com', 'blob:'],
    imgSrc: ["'self' 'unsafe-inline'", 'data:'],
    // external api's here
    connectSrc: ["'self'", 'ws:', 'swapi.co'],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
    objectSrc: ["'none'"],
    mediaSrc: ["'none'"],
    frameSrc: ["'none'"]
  }
}

if (__DEV__) {
  csp.directives.connectSrc.push('http://localhost:3001')
  csp.directives.scriptSrc.push('http://localhost:3001')
}

app.use(helmet.contentSecurityPolicy(csp))
app.use(helmet.xssFilter())
app.use(helmet.frameguard('deny'))
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())

// Set view engine
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('build/public'))

app.get('*', (req, res) => {
  res.set('content-type', 'text/html')
  // yes, we can start sending down html right now....
  res.write('<!doctype html>')
  res.write(`<html>
  <head>
    <meta charset="utf-8">
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta httpEquiv="Content-Language" content="en" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=es6"></script>
    <script src="${assetUrl + assets.main.js}" defer></script>
    <!-- CHUNK -->`)
  res.flush()

  match({
    routes,
    history: createMemoryHistory(req.originalUrl)
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`)
    } else if (renderProps) {
      const html = ReactDOM.renderToString(<RouterContext {...renderProps} />)
      const { meta, title, link } = ReactHelmet.rewind()
      // finish sending the page to the browser
      res.write(`${meta} ${title} ${link}
  </head>
  <body>
    <div id="root"><div>${html}</div></div>
  </body>
</html>`)
      res.end()
    } else {
      res.status(404).send('Not found')
    }
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`> listening on port ${ process.env.PORT || 3000 }`)
})
