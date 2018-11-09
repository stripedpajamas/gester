import React, { Component } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import remark from 'remark'
import toHTML from 'remark-html'
import spanStuff from 'remark-bracketed-spans'
import { Parser } from 'html-to-react'
import emoji from 'node-emoji'
import classNames from '@sindresorhus/class-names'

const toReact = new Parser()

class Message extends Component {
  markMentions (text) {
    let highlighted = text
    this.props.myNames.forEach((name) => {
      const re = new RegExp(`(\\s|^)(${name})(\\b|\\s|$)`, 'g')
      highlighted = highlighted.replace(re, `[$2]{.mention}`)
    })
    return highlighted
  }
  makeSpansSafe (text) {
    // bc remark-bracketed-spans throws for stuff like s[mile]cat
    // yeah... if there are brackets but no braces it throws
    // i am so sad
    // in general
    // and with this in particular
    return text.replace(/(\[[^\]]+\])(?!\{)/g, '$1{.extra-brackets}')
  }
  process (msg, action, color) {
    // process markdown and emojis
    const msgStr = typeof msg === 'string' ? msg : JSON.stringify(msg)
    const emojified = emoji.emojify(msgStr, null, (e) => `[${e}]{.emoji}`)
    let input = this.markMentions(emojified)
    input = this.makeSpansSafe(input)
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
    const { author, color, message, skipAuthor, darkTheme } = this.props
    const { timestamp, author: id, text, action } = message

    const tinyTime = format(timestamp, 'HH:mm')
    const fullTime = format(timestamp, 'MMM DD HH:mm')
    const processedText = this.process(text, action, color)
    const messageClass = classNames(
      'message',
      {
        'message-action': action,
        'message--dark': darkTheme
      }
    )
    const timeClass = classNames(
      'message-time',
      { 'message-time-top': !skipAuthor }
    )

    if (action) {
      return (
        <span className={messageClass}>
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
      <span className={messageClass}>
        <span className={timeClass} title={fullTime}>
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
  color: PropTypes.string.isRequired,
  skipAuthor: PropTypes.bool.isRequired,
  darkTheme: PropTypes.bool
}

export default Message
