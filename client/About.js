import React, {Component} from 'react'

class About extends Component {
  constructor() {
    super()
    this.state = {
      value: 'About'
    }
  }
  onClick = (e) => {
    e.preventDefault()
    this.setState({value: 'clickeds'})
  }
  render () {
    return (
      <div onClick={this.onClick}>
        {this.state.value}
      </div>
    )
  }
}

export default About
