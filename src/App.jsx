import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { HotKeys } from 'react-hotkeys'
import * as Actions from './store/actions'
import ControlPanel from './components/ControlPanel'
import JoinPubModal from './components/JoinPubModal'
import MessageView from './components/MessageView'
import Input from './components/Input'
import AuthorDrawer from './components/AuthorDrawer'
import Notification from './components/Notification'

class App extends Component {
  constructor () {
    super()

    this.messageInput = React.createRef()
    this.controlPanel = React.createRef()
    this.handleFocusPMInput = this.handleFocusPMInput.bind(this)
    this.handleToggleMode = this.handleToggleMode.bind(this)

    this.keyMap = {
      focusPMInput: 'command+k',
      toggleMode: 'command+t'
    }
    this.hotKeyHandlers = {
      focusPMInput: this.handleFocusPMInput,
      toggleMode: this.handleToggleMode
    }
  }
  componentDidMount () {
    this.props.setupCore()
  }
  componentDidUpdate (prevProps) {
    // see if our recipients changed
    // if so, focus message input
    const newRecps = this.props.recipients
    const oldRecps = prevProps.recipients
    if (newRecps.length !== oldRecps.length) {
      this.messageInput.current.handleFocusInput()
      return
    }
    for (let i = 0; i < newRecps.length; i++) {
      if (newRecps[i] !== oldRecps[i]) {
        this.messageInput.current.handleFocusInput()
        return
      }
    }
  }

  handleFocusPMInput () {
    const pmInputFocused = this.controlPanel.current
      .getWrappedInstance()
      .handleFocusPMInput()
    if (!pmInputFocused) {
      this.messageInput.current.handleFocusInput()
    }
  }

  handleInputSubmit (msg) {
    this.props.sendMessage(msg)
  }

  handleToggleMode () {
    this.props.toggleMode()
  }

  render () {
    const hasNotification = this.props.error || this.props.notification
    const mode = this.props.mode.toLowerCase()
    return (
      <HotKeys keyMap={this.keyMap} handlers={this.hotKeyHandlers}>
        <div className={this.props.authorDrawerOpen ? 'main drawer-open' : 'main drawer-closed'}>
          {hasNotification &&
            <Notification
              error={this.props.error}
              notification={this.props.notification}
              onClose={this.props.clearNotification}
            />
          }
          {this.props.joiningPub &&
            <JoinPubModal />
          }
          <ControlPanel ref={this.controlPanel} />
          <div className='message-view'>
            <MessageView />
            <Input
              autoFocus
              className='messenger-input'
              placeholder={`Send ${mode} message`}
              onSubmit={this.handleInputSubmit}
              ref={this.messageInput}
            />
          </div>
          <AuthorDrawer />
        </div>
      </HotKeys>
    )
  }
}

App.propTypes = {
  setupCore: PropTypes.func.isRequired,
  joiningPub: PropTypes.bool.isRequired,
  authorDrawerOpen: PropTypes.bool.isRequired,
  recipients: PropTypes.array.isRequired,
  error: PropTypes.object,
  notification: PropTypes.string
}

const mapStateToProps = state => ({
  mode: state.mode,
  recipients: state.recipients,
  joiningPub: state.joiningPub,
  authorDrawerOpen: state.authorDrawerOpen,
  error: state.error,
  notification: state.notification
})

const mapDispatchToProps = dispatch => ({
  toggleMode: bindActionCreators(Actions.toggleMode, dispatch),
  setupCore: bindActionCreators(Actions.setupCore, dispatch),
  sendMessage: bindActionCreators(Actions.sendMessage, dispatch),
  clearNotification: bindActionCreators(Actions.clearNotification, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
