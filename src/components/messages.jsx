import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Message from './Message'
import { createUserColors } from '../helpers/randomColor'

class Messages extends Component {
  componentDidMount () {
    this.scrollToBottom()
  }
  componentDidUpdate () {
    this.scrollToBottom()
  }
  scrollToBottom () {
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight
  }
  render () {
    const { messages, authors } = this.props
    const colors = createUserColors(messages)
    return (
      <div className='messages' ref={el => { this.messagesDiv = el }}>
        {messages.map((message) => {
          const id = message.author
          const author = (authors[id] || {}).name || id
          return (<Message
            author={author}
            key={message.key}
            message={message}
            color={colors[message.authorName]}
          />)
        })}
      </div>
    )
  }
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
  authors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  authors: state.authors,
  messages: state.messages
})

export default connect(mapStateToProps)(Messages)
