import React from 'react'
import { connect } from 'react-redux'
// import { bindActionsCreators } from 'redux'
import PropTypes from 'prop-types'

const Messages = (props) => (
  <div className='messages'>
    {console.log(props.messages)}
    {props.messages.map((message) => (
      <div className='message'>
        <p>{new Date(message.timestamp).toDateString()}</p>
        <p>{message.authorName()}</p>
        <p>{message.text}</p>
      </div>
    ))
    }
  </div>
)

const mapStateToProps = state => ({
  messages: state.messages
})

const mapDispatchToProps = dispatch => ({

})

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
