import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Message from './Message'

class Messages extends Component {
  render () {
    return (
      <div className='messages'>
        {this.props.messages.map((message) => (
          <Message key={message.key} message={message} />
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
