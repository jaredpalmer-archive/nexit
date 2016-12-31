import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './Root'

const root = document.querySelector('#root')

const mount = (RootComponent) => {
  render(
    <AppContainer>
      <RootComponent />
    </AppContainer>,
    root
  )
}

// Setup Hot Module Replacement x React Hot Loader
if (module.hot) {
  // Remove some warnings and errors related to
  // hot reloading and System.import conflicts.
  require('../common/utils/hmr'); // eslint-disable-line

  module.hot.accept('./Root', function () {
    // eslint-disable-next-line global-require,import/newline-after-import
    const RootComponent = require('./Root').default
    mount(RootComponent)
  })
}

mount(Root)
