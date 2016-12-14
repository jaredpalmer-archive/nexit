import React from 'react';
import { Router, browserHistory } from 'react-router';
import routes from '../common/routes';

// We need a Root component for React Hot Loading.
function Root() {
  return (
    <Router history={browserHistory} routes={routes} />
  );
}

export default Root;
