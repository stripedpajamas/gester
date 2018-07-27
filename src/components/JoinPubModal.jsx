import React, { Component } from 'react'
import PropTypes from 'prop-types'

class JoinPubModal extends Component {
  constructor (props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleKeyPress (e) {
    if (e.key === 'Escape') {
      this.props.onCancel()
    }
    if (e.key === 'Enter') {
      const inviteCode = e.target.value
      this.props.onSubmit(inviteCode)
      this.pubInput.value = ''
    }
  }

  handleSubmit () {
    const inviteCode = this.pubInput.value
    this.props.onSubmit(inviteCode)
    this.pubInput.value = ''
  }

  handleCancel () {
    this.props.onCancel()
  }

  render () {
    return (
      <div>
        <div className='join-pub modal'>
          <input
            className='modal-input'
            type='text'
            placeholder={`Paste pub invite code here...`}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleChange}
            ref={el => { this.pubInput = el }}
          />
          <button className='modal-button button' onClick={this.handleCancel}>cancel</button>
          <button className='modal-button button' onClick={this.handleSubmit}>join</button>
        </div>
        <div className='modal-overlay' onClick={this.handleCancel} />
      </div>
    )
  }
}

JoinPubModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default JoinPubModal
