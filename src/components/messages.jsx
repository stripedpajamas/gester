import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'
import Message from './Message'

class Messages extends Component {
  constructor () {
    super()
    this.handleNameClick = this.handleNameClick.bind(this)
  }
  componentDidMount () {
    this.scrollToBottom()
  }
  componentDidUpdate () {
    this.scrollToBottom()
  }
  scrollToBottom () {
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight
  }

  handleNameClick (id) {
    this.props.openAuthorDrawer(id)
  }

  render () {
    const { messages, authors } = this.props
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
            skipAuthor={skipAuthor}
            onClick={this.handleNameClick}
          />)
        })}
      </div>
    )
  }
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
  authors: PropTypes.object.isRequired,
  openAuthorDrawer: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  authors: state.authors,
  messages: state.messages
})

const mapDispatchToProps = dispatch => ({
  openAuthorDrawer: bindActionCreators(Actions.openAuthorDrawer, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
