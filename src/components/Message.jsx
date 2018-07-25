import React, { Component } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

class Message extends Component {
  render () {
    const { timestamp, authorName, author: id, text } = this.props.message

    const time = format(timestamp, 'MMM DD HH:mm')
    const author = authorName()

    return (
      <div className='message'>
        <span className='message-time'>{time}</span>
        <span className='message-author' title={id}>{author}</span>
        <span className='message-text'>{text}</span>
      </div>
    )
  }
}

Message.propTypes = {
  message: PropTypes.object
}

export default Message
