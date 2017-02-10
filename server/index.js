/* global __DEV__ */
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import hpp from 'hpp'
import http from 'http'

import React from 'react'
import ReactDOM from 'react-dom/server'
import ReactHelmet from 'react-helmet'
import RouterContext from 'react-router/lib/RouterContext'
import createMemoryHistory from 'react-router/lib/createMemoryHistory'
import match from 'react-router/lib/match'
import { ComponentData } from '../lib/ComponentData'
import resolve from '../lib/resolve'

import routes from '../common/routes'
const assets = require('../build/assets.json')
const assetUrl = ''
const app = express()


// Hide all software information
app.disable('x-powered-by')

// Accept and parse JSON with body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

// Tweak CSP in development to allow loading js assets from
// the client assets server (which is on a different port)
// if (__DEV__) {
//   csp.directives.connectSrc.push('http://localhost:3001')
//   csp.directives.scriptSrc.push('http://localhost:3001')
// }

// Make express more secure
app.use(helmet.contentSecurityPolicy(csp))
app.use(helmet.xssFilter())
app.use(helmet.frameguard('deny'))
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())

// Set view engine
app.use(compression())

// Serve up static assets
app.use(express.static('build/public'))

// Render React
app.get('/*', (req, res) => {
  res.set('content-type', 'text/html')
  match({
    routes,
    history: createMemoryHistory(req.originalUrl)
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`)
    } else if (renderProps) {
      resolve(RouterContext, renderProps)
      .then(data => {
          const html = ReactDOM.renderToString(
            <ComponentData data={data}>
              <RouterContext {...renderProps} />
            </ComponentData>
          )
          const { meta, title, link } = ReactHelmet.rewind()
          // finish sending the page to the browser
          res.status(200).send(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta httpEquiv="Content-Language" content="en" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=es6"></script>
    ${meta} ${title} ${link}
    <script src="${assetUrl + assets.vendor.js}" defer></script>
    <script src="${assetUrl + assets.main.js}" defer></script>
  </head>
  <body>
    <div id="root"><div>${html}</div></div>
    <script>window._initialState = ${JSON.stringify(data)}</script>
  </body>
</html>`)
      })
      .catch(e => res.status(404).send('Not found'))
    } else {
      res.status(404).send('Not found')
    }   
  })
})

// Create HTTP Server
const server = http.createServer(app)

const port = (parseInt(process.env.PORT, 10) || 3000) - !!__DEV__
const proxyPort = port + 1;
// Start
const listener = server.listen(port, err => {
  if (err) throw err
  console.log(`🚀  started on port ${proxyPort}`)
})

export default listener
