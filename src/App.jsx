import React, { Component } from 'react'
import electron from 'electron'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from './store/actions'
import ControlPanel from './components/ControlPanel'
import Messages from './components/Messages'
import MessageInput from './components/MessageInput'

const core = electron.remote.getGlobal('core')

class App extends Component {
  componentDidMount () {
    core.mode.setPublic() // so we always start public
    this.props.updateMessages()
    core.events.messages.onNew(() => {
      // update state with latest copy of msgs
      this.props.updateMessages()
    })
    core.events.authors.onNew(() => {
      // a new author means we need to update our messages' authors
      this.props.updateMessages()
    })
    core.events.mode.onChange(() => {
      this.props.updateMessages()
    })
  }

  render () {
    return (
      <div className='main'>
        <ControlPanel />
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
