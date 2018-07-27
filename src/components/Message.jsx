import React, { Component } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

class Message extends Component {
  render () {
    const { author, message } = this.props
    const { timestamp, author: id, text } = message

    const time = format(timestamp, 'MMM DD HH:mm')

    return (
      <div className='message'>
        <span className='message-time'>{time}</span>
        <span
          style={{ color: this.props.color }}
          className='message-author'
          title={id}
        >
          {author}
        </span>
        <span className='message-text'>{text}</span>
      </div>
    )
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  author: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}

export default Message
