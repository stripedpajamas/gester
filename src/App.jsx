import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from './store/actions'
import PropTypes from 'prop-types'

class App extends Component {
  constructor () {
    super()
    this.handleOnClick = this.handleOnClick.bind(this)
  }
  handleOnClick () {
    this.props.updateMessages()
  }
  render () {
    return (
      <div>
        <h1>hello world</h1>
        <button onClick={this.handleOnClick}>click me for news</button>
      </div>
    )
  }
}

App.propTypes = {
  updateMessages: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
  updateMessages: bindActionCreators(Actions.updateMessages, dispatch)
})

export default connect(null, mapDispatchToProps)(App)
