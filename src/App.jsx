import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from './store/actions'
import Messages from './components/messages'
import MessageInput from './components/messageInput'

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
        <Messages />
        <MessageInput />
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
