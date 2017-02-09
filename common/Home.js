import React, {Component} from 'react'

class Home extends Component {
  static async getInitialProps() {
    const thing = await Promise.resolve({ hello: 'world' })
    return thing
  }

  render () {
    return (
      <div>
        this is dope shit {this.props.hello}
      </div>
    )
  }
}

export default Home
