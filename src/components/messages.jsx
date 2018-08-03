import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Message from './Message'

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
    const { messages, authors, myNames } = this.props
    return (
      <div className='messages' ref={el => { this.messagesDiv = el }}>
        {messages.map((message, idx) => {
          const id = message.author
          const author = (authors[id] || {}).name || id
          // so that we can group messages from the same author,
          // tell our child component if the previous message
          // was sent from the same author
          const skipAuthor = !!(messages[idx - 1] && messages[idx - 1].author === message.author)
          return (<Message
            author={author}
            key={message.key}
            message={message}
            myNames={myNames}
            skipAuthor={skipAuthor}
          />)
        })}
      </div>
    )
  }
}

Messages.propTypes = {
  myNames: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  authors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  authors: state.authors,
  myNames: state.myNames,
  messages: state.messages
})

export default connect(mapStateToProps)(Messages)
