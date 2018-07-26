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
    this.handleRecipientsChange = this.handleRecipientsChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.state = {
      rawRecipients: ''
    }
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
      this.setState({ rawRecipients: '' })
      core.commands.private(recipients)
        .then(({ result }) => {
          this.props.setPrivate()
        })
        .catch((e) => console.log(e))
    }
  }

  handleButtonClick (e) {
    e.preventDefault()
    this.props.setPublic()
    core.commands.quit()
      .then(({ result }) => console.log(result))
      .catch((e) => console.log(e))
  }

  render () {
    return (
      <div className='control-panel'>
        <div>
          <input
            className='control-panel__input'
            type='text'
            placeholder='Start private message...'
            onKeyPress={this.handleKeyPress}
            onChange={this.handleRecipientsChange}
            value={this.state.rawRecipients}
          />
        </div>
        <div>
          {this.props.private &&
            <button className='button' onClick={this.handleButtonClick}>public</button>
          }
        </div>
        <div className='control-panel__users'>
          <h1>users</h1>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  private: state.private
})

const mapDispatchToProps = dispatch => ({
  setPrivate: bindActionCreators(Actions.setPrivate, dispatch),
  setPublic: bindActionCreators(Actions.setPublic, dispatch)
})

ControlPanel.propTypes = {
  setPrivate: PropTypes.func.isRequired,
  setPublic: PropTypes.func.isRequired,
  private: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
