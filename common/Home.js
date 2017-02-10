import React, {Component} from 'react'
import Helmet from 'react-helmet'
import Counter from './Counter'

class Home extends Component {
  static async getInitialProps(ctx) {
    const thing = await Promise.resolve({ hello: 'world' })
    return thing
  }

  render () {
    return (
      <div>
        <Helmet title='Home' />
        This is Home {this.props.hello}
        <Counter />
      </div>
    )
  }
}

export default Home
