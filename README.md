# NEXiT.js 

Think Brexit, but for Next.js... but not really.

I love Next.js, but I'm not the biggest fan of the filesystem-as-the-router approach. So I put this together. It mashes up the data fetching of Next with your good old friend react-router v3. Everything else is universal react server-side rendering boilerplate...yawn.

## Routing
Routing is handled by react-router v3. We declare all routes in a centralized file as follows:

```js
// common/routes.js
/* global __DEV__ __CLIENT__ */
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import loadRoute from './loadRoute'
import App from './App'

// We use `getComponent` to dynamically load routes. Looks for routes in the same dir
// at the moment.
// @see https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
const routes = (
  <Route path='/' component={App}>
    <IndexRoute getComponent={loadRoute('Home')} />
    <Route path='/user/:name' getComponent={loadRoute('Profile')} />
    <Route path='/user/:name/repo/:repo' getComponent={loadRoute('Repo')} />
  </Route>
)

// Hot Module Replacement breaks when we dynamically
// resolve routes so we globally require them here as a workaround.
// @see https://github.com/gaearon/react-hot-loader/issues/288
if (module.hot && __CLIENT__ &&  __DEV__) {
  require('./Profile')    // eslint-disable-line global-require
  require('./Repo')   // eslint-disable-line global-require
}

export default routes
```

Each route is dynamically loaded using a util `loadRoute.js`, which abstracts away `System.import()` and handles some caching.
Note: During development, dynamic loading is turned off because it doesn't work well when using react-hot-loader + react-router 3 together (which we are).

## Data Fetching
When you need state, lifecycle hooks or *initial data population* you can export a `React.Component` like so:

```js
import React from 'react'

export default class MyPage extends React.Component {
  static async getInitialProps ({ req }) {
    return req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }
  render () {
    return <div>
      Hello World {this.props.userAgent}
    </div>
  }
}
```

Notice that to load data when the page loads, we use `getInitialProps` which is an async static method. It can asynchronously fetch anything that resolves to a JavaScript plain Object, which populates props.

For the initial page load, `getInitialProps` will execute on the server only. `getInitialProps` will only be executed on the client when navigating to a different route via react-router v3's `<Link/>` component or using react-router's imperative APIs.


### Parameterized routes and data fetching
`getInitialProps` receives a context object with the following properties:

- `router` - react-router's v3 props! (e.g. `location`, `query`, `params`)
- `req` - HTTP request object (server only)
- `res` - HTTP response object (server only)

Thus, you can fetch data based on the current route like so:
```js
import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'

class Repo extends Component {
  static async getInitialProps({ router, req, res }) {
    const raw = await fetch(`https://api.github.com/${router.params.name}/repos/${router.params.repo}`)
    const repo = await raw.json()
    return { repo: repo }
  }

  render () {
    return (
      <div>
        <h1>{this.props.repo.full_name}</h1>
      </div>
    )
  }
}

export default Repo
```

## Roadmap
Right now this is a boilerplate, which isn't ideal. Depending on how "frameworky" this gets there are a few possible outcomes:

- Abstract the data-fetching into its own package
- Abstract the build tools into their own repo.
- Combine this build tool with [palmerhq/backpack](https://github.com/palmerhq/backpack) project. Backpack can thus support universal rendering. Then make this a just Backpack app.
- Make this the next version of react-production-starter.

## Inspiration:

- Most of the data-fetching code is taken directly from Gabe Ragland's [react-component-data](https://github.com/gragland/react-component-data). This version modifies Gabe's implementation by passing a Next.js-like `ctx` argument to `getInitialProps()` that includes `renderProps`, `req`, and `res`.
- The development webpack setup comes from Ueno's starterkit

## Author

- Jared Palmer - ([@jarepalmer](https://twitter.com/jaredpalmer))

