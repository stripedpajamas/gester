import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from './store/actions'
import Messages from './components/messages'
import MessageInput from './components/messageInput'

class App extends Component {
  render() {
    return (
      <div className='main'>
        <div className='message-view'>
          <Messages />
          <MessageInput />
        </div>
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
