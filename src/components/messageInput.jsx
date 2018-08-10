import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import tabComplete from '../helpers/tabComplete'
import * as Actions from '../store/actions'

class MessageInput extends Component {
  constructor (props) {
    super(props)

    this.tabCompleter = null

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocusMessageInput = this.handleFocusMessageInput.bind(this)
  }

  handleKeyDown (e) {
    const msg = e.target.value
    if (e.key !== 'Tab') {
      this.tabCompleter = null
    }
    if (e.key === 'Tab') {
      if (!this.tabCompleter) {
        this.tabCompleter = tabComplete(msg)
      }
      this.messageInput.value = this.tabCompleter()
      e.preventDefault()
    }
    if (e.key === 'Enter') {
      this.props.sendMessage(msg)
      this.messageInput.value = ''
    }
  }

  handleFocusMessageInput () {
    this.messageInput.focus()
  }

  render () {
    const mode = this.props.mode.toLowerCase()
    return (
      <div className='messenger'>
        <input
          autoFocus
          className='messenger-input'
          type='text'
          placeholder={`Send ${mode} message`}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          ref={el => { this.messageInput = el }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mode: state.mode
})

const mapDispatchToProps = dispatch => ({
  sendMessage: bindActionCreators(Actions.sendMessage, dispatch)
})

MessageInput.propTypes = {
  mode: PropTypes.string.isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(MessageInput)
