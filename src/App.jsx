import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { HotKeys } from 'react-hotkeys'
import classNames from '@sindresorhus/class-names'
import * as Actions from './store/actions'
import ControlPanel from './components/ControlPanel'
import MessageView from './components/MessageView'
import Input from './components/Input'
import Notification from './components/Notification'
import Loader from './components/Loader'

class App extends Component {
  constructor () {
    super()

    this.messageInput = React.createRef()
    this.controlPanel = React.createRef()
    this.handleOpenPrivate = this.handleOpenPrivate.bind(this)
    this.handleToggleMode = this.handleToggleMode.bind(this)
    this.handleInputSubmit = this.handleInputSubmit.bind(this)

    this.keyMap = {
      openPrivate: 'command+k',
      toggleMode: 'command+t'
    }
    this.hotKeyHandlers = {
      openPrivate: this.handleOpenPrivate,
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

  handleOpenPrivate () {
    const alreadyOpen = this.controlPanel.current
      .getWrappedInstance()
      .handlePrivateButton()
    if (!alreadyOpen) {
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
    const { darkTheme } = this.props
    if (this.props.loading) {
      return <Loader darkTheme={darkTheme} />
    }
    const hasNotification = this.props.error || this.props.notification
    const mode = this.props.mode.toLowerCase()
    const messageViewClasses = classNames(
      'message-view',
      { 'message-view--dark': darkTheme }
    )
    return (
      <HotKeys keyMap={this.keyMap} handlers={this.hotKeyHandlers}>
        <div className='main'>
          {hasNotification &&
            <Notification
              darkTheme={darkTheme}
              error={this.props.error}
              notification={this.props.notification}
              onClose={this.props.clearNotification}
            />
          }
          <ControlPanel ref={this.controlPanel} />
          <div className={messageViewClasses}>
            <MessageView />
            <Input
              darkTheme={darkTheme}
              autoFocus
              className='messenger-input'
              placeholder={`Send ${mode} message`}
              onSubmit={this.handleInputSubmit}
              ref={this.messageInput}
            />
          </div>
        </div>
      </HotKeys>
    )
  }
}

App.propTypes = {
  setupCore: PropTypes.func.isRequired,
  authorDrawerOpen: PropTypes.bool.isRequired,
  recipients: PropTypes.array.isRequired,
  error: PropTypes.object,
  notification: PropTypes.string,
  loading: PropTypes.bool,
  darkTheme: PropTypes.bool
}

const mapStateToProps = state => ({
  mode: state.mode,
  recipients: state.recipients,
  authorDrawerOpen: state.authorDrawerOpen,
  error: state.error,
  notification: state.notification,
  loading: state.loading,
  darkTheme: state.darkTheme
})

const mapDispatchToProps = dispatch => ({
  toggleMode: bindActionCreators(Actions.toggleMode, dispatch),
  setupCore: bindActionCreators(Actions.setupCore, dispatch),
  sendMessage: bindActionCreators(Actions.sendMessage, dispatch),
  clearNotification: bindActionCreators(Actions.clearNotification, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
