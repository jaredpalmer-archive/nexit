import React from 'react'
import ReactDOM from 'react-dom'
import { match, browserHistory, Router } from 'react-router';
import routes from '../common/routes';

const root = document.querySelector('#root')

const onError = function(err) {
  console.error(err);
};

match({ history: browserHistory, routes }, (err, redirect, props) => {
  ReactDOM.render(
      <Router {...props} onError={onError} />,
   root
  );
});


// const mount = (RootComponent) => {
//   render( <RootComponent />, root)
// }

// // if (module.hot) {
// //   module.hot.accept('./Root', () => {
// //     // eslint-disable-next-line global-require,import/newline-after-import
// //     const RootComponent = require('./Root').default
// //     mount(RootComponent)
// //   })
// // }

// mount(Root)
