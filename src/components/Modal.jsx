import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from './Input'

class Modal extends Component {
  constructor (props) {
    super(props)

    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyUp (e) {
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
    const { darkTheme } = this.props
    return (
      <div>
        <div className={`modal ${darkTheme ? 'modal--dark' : ''}`}>
          <div className='modal-content'>
            <p className='modal-text'>{this.props.text}</p>
            <Input
              autoFocus
              className='modal-content__input'
              onBlur={this.props.handleCancel}
              onSubmit={this.props.handleSubmit}
              placeholder={this.props.inputText}
            />
          </div>
          <div className='modal-actions'>
            <button className='modal-cancel' onClick={this.props.handleCancel}>{this.props.cancelText}</button>
            <button className='modal-submit' onClick={() => this.props.handleSubmit(this.inputVal.value)}>{this.props.submitText}</button>
          </div>
        </div>
        <div
          className={`modal-overlay ${darkTheme ? 'modal-overlay--dark' : ''}`}
          onClick={this.props.handleCancel}
        />
      </div>
    )
  }
}

Modal.propTypes = {
  inputText: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  text: PropTypes.string,
  cancelText: PropTypes.string,
  submitText: PropTypes.string,
  darkTheme: PropTypes.bool
}

Modal.defaultProps = {
  text: '',
  cancelText: 'cancel',
  submitText: 'submit'
}

export default Modal
