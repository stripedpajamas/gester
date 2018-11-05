import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'
import Message from './Message'
import Loader from './Loader'

class MessageView extends Component {
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
    this.props.openAuthorView(id)
  }

  renderMessages () {
    const { messages, authors, myNames, darkTheme } = this.props
    if (!messages.length) {
      return (
        <div className='empty'>
          <span>Nothing to see here 🐥</span>
        </div>
      )
    }
    if (messages[0].loading) {
      return (
        <Loader small />
      )
    }
    return messages.map((message, idx) => {
      const id = message.author
      const author = authors[id] || id
      // so that we can group messages from the same author,
      // tell our child component if the previous message
      // was sent from the same author
      const skipAuthor = !!(messages[idx - 1] && messages[idx - 1].author === message.author)
      return (<Message
        darkTheme={darkTheme}
        author={author}
        key={message.key}
        message={message}
        myNames={myNames}
        skipAuthor={skipAuthor}
        onClick={this.handleNameClick}
      />)
    })
  }

  render () {
    return (
      <div className='messages' ref={el => { this.messagesDiv = el }}>
        {
          this.renderMessages()
        }
      </div>
    )
  }
}

MessageView.propTypes = {
  myNames: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  authors: PropTypes.object.isRequired,
  openAuthorView: PropTypes.func.isRequired,
  darkTheme: PropTypes.bool
}
const mapStateToProps = state => ({
  authors: state.authors,
  myNames: state.myNames,
  messages: state.messages,
  darkMode: state.darkTheme
})

const mapDispatchToProps = dispatch => ({
  openAuthorView: bindActionCreators(Actions.openAuthorView, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageView)
