import React, {Component} from 'react'
import Helmet from 'react-helmet'
import Counter from './Counter'

class About extends Component {
  state = {
    value: ''
  }

  static async getInitialProps() {
    const thing = await Promise.resolve({ hello: 'world' })
    return thing
  }

  onClick = (e) => {
    e.preventDefault()
    this.setState({value: 'clicked'})
  }

  render () {
    return (
      <div onClick={this.onClick}>
        <Helmet title='About' />
        {this.state.value}
        About {this.props.hello}
        <Counter />
      </div>
    )
  }
}

export default About
