import React, { Component } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import emoji from 'node-emoji'
import remark from 'remark'
import remarkReact from 'remark-react'
import { getAuthorColor, getMeColor } from '../helpers/randomColor'

class Message extends Component {
  constructor () {
    super()
    this.state = { hasEmoji: false, text: '' }
  }
  componentDidMount () {
    const { message } = this.props
    const { text } = message
    this.process(text)
  }
  process (msg) {
    // process markdown and emojis
    const emojified = emoji.emojify(msg)
    this.setState({
      text: remark().use(remarkReact).processSync(emojified).contents,
      hasEmoji: msg !== emojified
    })
  }

  render () {
    const { author, message, skipAuthor } = this.props
    const { timestamp, author: id } = message

    const tinyTime = format(timestamp, 'HH:mm')
    const fullTime = format(timestamp, 'MMM DD HH:mm')
    const color = message.fromMe ? getMeColor() : getAuthorColor(author)

    const timeClass = ['message-time']
    if (!skipAuthor && this.state.hasEmoji) {
      timeClass.push('message-time-top-emoji')
    } else if (!skipAuthor) {
      timeClass.push('message-time-top')
    } else if (this.state.hasEmoji) {
      timeClass.push('message-time-emoji')
    }
    const authorClass = skipAuthor ? 'message-author' : 'message-author'

    return (
      <span className='message'>
        <span className={timeClass.join(' ')} title={fullTime}>
          {!skipAuthor}
          {tinyTime}
        </span>
        <span>
          {!skipAuthor && <span
            style={{ color }}
            className={authorClass}
            title={id}
            onClick={() => this.props.onClick(id)}
          >
            {author}
          </span>}
          {this.state.text}
        </span>
      </span>
    )
  }
}

Message.propTypes = {
  onClick: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  author: PropTypes.string.isRequired,
  skipAuthor: PropTypes.bool.isRequired
}

export default Message
