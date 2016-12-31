import React, {Component} from 'react'

class About extends Component {
  state = {
    value: ''
  }

  onClick = (e) => {
    e.preventDefault()
    this.setState({value: 'clicked'})
  }

  render () {
    return (
      <div onClick={this.onClick}>
        {this.state.value}
        This is the about
      </div>
    )
  }
}

export default About
