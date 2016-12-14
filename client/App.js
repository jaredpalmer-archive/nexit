import React, {Component} from 'react'
import Link from 'react-router/lib/Link'

class App extends Component {
  render () {
    return (
      <div>
      <Link to="/about">About</Link>
      <Link to="/">Home</Link>
        {this.props.children}
      </div>
    )
  }
}

export default App
