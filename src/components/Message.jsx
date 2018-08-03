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
  process (msg) {
    // process markdown and emojis
    const emojified = emoji.emojify(msg, null, (e) => `[${e}]{.emoji}`)
    const input = this.markMentions(emojified)
    const marked = remark()
      .use(spanStuff)
      .use(toHTML)
      .processSync(input)
      .toString()
    return toReact.parse(`<div>${marked}</div>`)
  }

  render () {
    const { author, message, skipAuthor } = this.props
    const { timestamp, author: id, text } = message

    const tinyTime = format(timestamp, 'HH:mm')
    const fullTime = format(timestamp, 'MMM DD HH:mm')
    const color = message.fromMe ? getMeColor() : getAuthorColor(author)
    const processedText = this.process(text)

    const timeClass = ['message-time']
    if (!skipAuthor) {
      // we are rendering the author, so push the time down a bit
      timeClass.push('message-time-top')
    }

    return (
      <span className='message'>
        <span className={timeClass.join(' ')} title={fullTime}>
          {!skipAuthor}
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
