import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import * as Actions from '../store/actions'

class MessageInput extends Component {
  constructor (props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleKeyPress (e) {
    const msg = e.target.value
    if (e.key === 'Enter') {
      this.props.sendMessage(msg)
      this.messageInput.value = ''
    }
  }

  render () {
    const mode = this.props.mode.toLowerCase()
    return (
      <div className='messenger'>
        <input
          className='messenger-input'
          type='text'
          placeholder={`Send ${mode} message`}
          onKeyPress={this.handleKeyPress}
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)
