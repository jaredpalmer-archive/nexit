import express from 'express'
import React from 'react'
import ReactDOM from 'react-dom/server'
import RouterContext from 'react-router/lib/RouterContext';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import match from 'react-router/lib/match';
import routes from '../common/routes'
import bodyParser from 'body-parser'
import assets from '../assets.json'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('static', express.static('build/client'))
const template = (html = '') => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta charSet='utf-8' />
    <meta httpEquiv="Content-Language" content="en" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link id="favicon" rel="shortcut icon" href="/kyt-favicon.png" sizes="16x16 32x32" type="image/png" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css">
    <title>RP</title>
  </head>
  <body>
    <div id="root">${html}</div>
    <script src="/static/${assets.main.js}"></script>
  </body>
</html>
  `

app.get('/*', (req, res) => {
  const history = createMemoryHistory(req.originalUrl);

   match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
    } else if (renderProps) {
      const html = ReactDOM.renderToString(<RouterContext {...renderProps} />)
      res.status(200).send(template(html))
    } else {
      res.status(404).send('Not found');
    }
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`> listening on port ${ process.env.PORT || 3000 }`)
})
