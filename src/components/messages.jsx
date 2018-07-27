import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Message from './Message'
import { createUserColors } from '../helpers/randomColor'

class Messages extends Component {
  render () {
    const { messages } = this.props
    const colors = createUserColors(messages)
    return (
      <div className='messages'>
        {messages.map((message) => (
          <Message key={message.key} message={message} color={colors[message.authorName]} />
        ))}
      </div>
    )
  }
}

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired
}
const mapStateToProps = state => ({
  messages: state.messages
})

export default connect(mapStateToProps)(Messages)
