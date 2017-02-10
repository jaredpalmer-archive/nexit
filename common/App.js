import React from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'

const App = ({ children }) => {
  return (
    <div>
      <Helmet title='Razzle' />
      <Link to='/'>Homes</Link>
      <Link to='/about'>Abousssst</Link>
      {children}
    </div>
  )
}

export default App
