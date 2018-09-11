import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Modal extends Component {
  constructor (props) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleKeyDown (e) {
    if (e.key === 'Escape') {
      this.props.handleCancel()
      return
    }
    if (e.key === 'Enter') {
      const val = e.target.value
      this.props.handleSubmit(val)
      this.inputVal.value = ''
    }
  }

  render () {
    return (
      <div>
        <div className='modal'>
          <div>
            <input
              className='modal-input'
              type='text'
              placeholder={this.props.inputText}
              ref={el => { this.inputVal = el }}
            />
          </div>
          <div>
            <button className='modal-cancel button' onClick={this.props.handleCancel}>{this.props.cancelText}</button>
            <button className='modal-submit button' onClick={() => this.props.handleSubmit(this.inputVal.value)}>{this.props.submitText}</button>
          </div>
        </div>
        <div className='modal-overlay' onClick={this.handleCancel} />
      </div>
    )
  }
}

Modal.propTypes = {
  inputText: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelText: PropTypes.string,
  submitText: PropTypes.string
}

Modal.defaultProps = {
  cancelText: 'cancel',
  submitText: 'submit'
}

export default Modal
