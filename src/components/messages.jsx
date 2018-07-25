import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { updateMessages } from '../store/actions';
import * as Actions from '../store/actions'

class Messages extends Component {
  componentWillMount () {
    this.props.updateMessages()
  }

  render () {
    return (
      <div className='messages'>
        {this.props.messages.map((message) => (
          <div className='message'>
            <p>{new Date(message.timestamp).toDateString()}</p>
            <p>{message.authorName()}</p>
            <p>{message.text}</p>
          </div>))}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  messages: state.messages
})

const mapDispatchToProps = dispatch => ({
  updateMessages: bindActionCreators(Actions.updateMessages, dispatch)
})

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateMessages: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
