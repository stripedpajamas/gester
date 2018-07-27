import React, { Component } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

class Message extends Component {
  render () {
    const { timestamp, authorName: name, author: id, text } = this.props.message

    if (typeof name === 'function') {
      console.log('wtf', this.props.message)
    }

    const time = format(timestamp, 'MMM DD HH:mm')

    return (
      <div className='message'>
        <span className='message-time'>{time}</span>
        <span style={{ color: this.props.color }}className='message-author' title={id}>{name}</span>
        <span className='message-text'>{text}</span>
      </div>
    )
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired
}

export default Message
