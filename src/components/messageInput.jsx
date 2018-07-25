import React, { Component } from 'react'

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
      // this will be replaced with sending a message
      console.log(e.target.value)
      this.setState({ message: '' })
    }
  }

  handleChange (e) {
    this.setState({ message: e.target.value })
  }

  render () {
    return (
      <div>
        <input type='text' onKeyPress={this.handleKeyPress} onChange={this.handleChange} value={this.state.message} />
      </div>
    )
  }
}

export default MessageInput
