import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import classNames from '@sindresorhus/class-names'

class Notification extends Component {
  constructor () {
    super()

    this.timeout = null
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount () {
    this.timeout = setTimeout(() => { this.handleClose() }, 4500)
  }

  componentWillUnmount () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  handleClose () {
    this.props.onClose()
  }

  render () {
    const { error, notification, darkTheme } = this.props
    const classes = classNames(
      'toast',
      {
        'error': error,
        'notification': notification,
        'error--dark': error && darkTheme,
        'notification--dark': notification && darkTheme
      }
    )
    const text = (error || {}).message || notification

    return (
      <div className={classes} onClick={this.handleClose}>
        <span>{text}</span>
        <FontAwesomeIcon icon={faTimes} />
      </div>
    )
  }
}

Notification.propTypes = {
  onClose: PropTypes.func.isRequired,
  error: PropTypes.object,
  notification: PropTypes.string,
  darkTheme: PropTypes.bool
}

export default Notification
