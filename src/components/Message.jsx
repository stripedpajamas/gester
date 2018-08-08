import React, { Component } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import remark from 'remark'
import toHTML from 'remark-html'
import spanStuff from 'remark-bracketed-spans'
import { Parser } from 'html-to-react'
import emoji from 'node-emoji'
import { getAuthorColor, getMeColor } from '../helpers/randomColor'

const toReact = new Parser()

class Message extends Component {
  markMentions (text) {
    let highlighted = text
    this.props.myNames.forEach((name) => {
      const re = new RegExp(`(${name})`, 'g')
      highlighted = highlighted.replace(re, `[$1]{.mention}`)
    })
    return highlighted
  }
  process (msg, action, color) {
    // process markdown and emojis
    const emojified = emoji.emojify(msg, null, (e) => `[${e}]{.emoji}`)
    const input = this.markMentions(emojified)
    const marked = remark()
      .use(spanStuff)
      .use(toHTML)
      .processSync(input)
      .toString()
    const toProcess = action
      ? `<span class='message-text-action' style='color: ${color};'>
          ${marked}
        </span>`
      : `<div>${marked}</div>`
    return toReact.parse(toProcess)
  }

  render () {
    const { author, message, skipAuthor } = this.props
    const { timestamp, author: id, text, action } = message

    const tinyTime = format(timestamp, 'HH:mm')
    const fullTime = format(timestamp, 'MMM DD HH:mm')
    const color = message.fromMe ? getMeColor() : getAuthorColor(author)
    const processedText = this.process(text, action, color)

    const timeClass = ['message-time']
    if (!skipAuthor) {
      // we are rendering the author, so push the time down a bit
      timeClass.push('message-time-top')
    }

    if (action) {
      return (
        <span className='message message-action'>
          <span className='message-time message-time-action' title={fullTime}>
            {tinyTime}
          </span>
          <span
            style={{ color }}
            className='message-author'
            title={id}
            onClick={() => this.props.onClick(id)}
          >
            {author}
          </span>
          {processedText}
        </span>
      )
    }

    return (
      <span className='message'>
        <span className={timeClass.join(' ')} title={fullTime}>
          {tinyTime}
        </span>
        <span>
          {!skipAuthor && <span
            style={{ color }}
            className='message-author'
            title={id}
            onClick={() => this.props.onClick(id)}
          >
            {author}
          </span>}
          {processedText}
        </span>
      </span>
    )
  }
}

Message.propTypes = {
  onClick: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  myNames: PropTypes.array.isRequired,
  author: PropTypes.string.isRequired,
  skipAuthor: PropTypes.bool.isRequired
}

export default Message
