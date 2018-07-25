import React, { Component } from 'react'
import electron from 'electron'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'

const core = electron.remote.getGlobal('core')

class ControlPanel extends Component {
  constructor () {
    super()
    this.handleGoPublic = this.handleGoPublic.bind(this)
    this.handleGoPrivate = this.handleGoPrivate.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleRecipientsChange = this.handleRecipientsChange.bind(this)
    this.state = {
      goingPrivate: false,
      rawRecipients: ''
    }
  }
  handleGoPublic () {
    this.setState({ goingPrivate: false })
    core.mode.setPublic()
  }
  handleGoPrivate () {
    // need some recipients to go private with
    // so allow them to enter that info
    this.setState({ goingPrivate: true })
  }
  handleRecipientsChange (e) {
    this.setState({ rawRecipients: e.target.value })
  }
  handleKeyPress (e) {
    if (e.key === 'Enter') {
      // this is a little to text based so we'll have to make it more fun
      const recipients = this.state.rawRecipients
        .split(',')
        .map(x => x.trim())
      core.commands.private(recipients)
        .then(({ result }) => console.log(result))
        .catch((e) => console.log(e))
    }
  }
  render () {
    return (
      <div className='control-panel'>
        <button onClick={this.handleGoPublic}>PUBLIC</button>
        <button onClick={this.handleGoPrivate}>PRIVATE</button>
        {this.state.goingPrivate &&
          <input
            type='text'
            onKeyPress={this.handleKeyPress}
            onChange={this.handleRecipientsChange}
          />
        }
      </div>
    )
  }
}

export default ControlPanel
