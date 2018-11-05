import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

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
    const classNames = [error ? 'error' : 'notification']
    const text = (error || {}).message || notification

    if (darkTheme) {
      classNames.push(`${classNames[0]}--dark`)
    }
    return (
      <div className={`toast ${classNames}`} onClick={this.handleClose}>
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
