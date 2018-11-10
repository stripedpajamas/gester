import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from '@sindresorhus/class-names'
import tabComplete from '../helpers/tabComplete'

class Input extends Component {
  constructor (props) {
    super(props)

    this.tabCompleter = null

    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocusInput = this.handleFocusInput.bind(this)
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
  }

  handleKeyUp (e) {
    const msg = e.target.value
    if (e.key === 'Escape') {
      this.props.onBlur()
      return
    }
    if (e.key === 'Enter') {
      this.props.onSubmit(msg)
      this.messageInput.value = ''
    }
  }

  handleFocusInput () {
    this.messageInput.focus()
  }

  render () {
    const { darkTheme } = this.props
    const classes = classNames(
      'messenger',
      { 'messenger--dark': darkTheme }
    )
    return (
      <div className={classes}>
        <input
          autoFocus={this.props.autoFocus}
          className={this.props.className}
          placeholder={this.props.placeholder}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          onChange={this.handleChange}
          ref={el => { this.messageInput = el }}
          type='text'
        />
      </div>
    )
  }
}

Input.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  darkTheme: PropTypes.bool
}

Input.defaultProps = {
  onFocus: () => {},
  onBlur: () => {}
}

export default Input
