import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class MessageInput extends Component {
  constructor (props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      message: ''
    }
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      // TODO this will be replaced with sending a message
      console.log(e.target.value)
      this.setState({ message: '' })
    }
  }

  handleChange (e) {
    this.setState({ message: e.target.value })
  }

  render () {
    const mode = this.props.private ? 'private' : 'public'
    return (
      <div className='messenger'>
        <input
          className='messenger-input'
          type='text'
          placeholder={`Send ${mode} message`}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
          value={this.state.message}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  private: state.private
})

MessageInput.propTypes = {
  private: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, null)(MessageInput)
