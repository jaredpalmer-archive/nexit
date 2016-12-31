import React, {Component} from 'react'
import { IndexLink, Link } from 'react-router'

const App = ({children}) => {
  return (
    <div>
      <Link to="/">Homes</Link>
      <Link to="/about">About</Link>
        {children}
    </div>
  )
}

export default App
