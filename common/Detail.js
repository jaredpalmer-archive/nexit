import React, {Component} from 'react'

class Detail extends Component {
  static async getInitialProps({ router, req, res }) {
    const thing = await Promise.resolve({
      hello: 'world',
      name: router.params.id 
    })

    return thing
  }

  render () {
    return (
      <div>
        this is dope {this.props.hello}
        {this.props.other}
      </div>
    )
  }
}

export default Detail
