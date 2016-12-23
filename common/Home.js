import React, {Component} from 'react'

class Home extends Component {
  onClick = (e) => {
    e.preventDefault()
    console.log('clicked')
  }
  render () {
    return (
      <div onClick={this.onClick}>
        Homes
      </div>
    )
  }
}

export default Home
