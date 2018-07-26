import React, { Component } from 'react'
import electron from 'electron'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import JoinPubModal from './JoinPubModal'
import * as Actions from '../store/actions'

const core = electron.remote.getGlobal('core')

class ControlPanel extends Component {
  constructor () {
    super()
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleModeButton = this.handleModeButton.bind(this)
    this.handlePubButton = this.handlePubButton.bind(this)
    this.handlePubCancel = this.handlePubCancel.bind(this)
    this.handlePubSubmit = this.handlePubSubmit.bind(this)
    this.handleRecentClick = this.handleRecentClick.bind(this)

    this.state = {
      joiningPub: false
    }
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      // this is a little to text based so we'll have to make it more fun
      const recipients = e.target.value
        .split(',')
        .map(x => x.trim())
      this.recipientsInput.value = ''
      core.commands.private(recipients)
        .then(() => { this.props.setPrivate() })
        .catch((e) => this.props.setError(e))
    }
  }

  handleModeButton (e) {
    e.preventDefault()
    this.props.setPublic()
    core.commands.quit()
      .then(({ result }) => this.props.setNotification(result))
      .catch((e) => this.props.setError(e))
  }

  handlePubButton (e) {
    this.setState({ joiningPub: true })
  }

  handlePubCancel (e) {
    this.setState({ joiningPub: false })
  }

  handlePubSubmit (invite) {
    core.commands.pub(invite)
      .then(({ result }) => this.props.setNotification(result))
      .catch((e) => this.props.setError(e))
  }

  handleRecentClick (recipients) {
    core.commands.private(recipients)
      .then(() => { this.props.setPrivate() })
      .catch((e) => this.props.setError(e))
  }

  render () {
    return (
      <div className='control-panel'>
        <div>
          <button className='button' onClick={this.handlePubButton}>+ join pub</button>
          {this.state.joiningPub &&
            <JoinPubModal
              onCancel={this.handlePubCancel}
              onSubmit={this.handlePubSubmit}
            />
          }
        </div>
        <div>
          <input
            className='control-panel__input'
            type='text'
            placeholder='New private message...'
            onKeyPress={this.handleKeyPress}
            ref={el => { this.recipientsInput = el }}
          />
        </div>
        <div>
          {this.props.private &&
            <button className='button' onClick={this.handleModeButton}>public</button>
          }
        </div>
        <div className='control-panel__users'>
          <h1>Recents</h1>
          <div className='recents'>
            {core.recents.get().map((recent, idx) => {
              const me = core.me.get()
              const current = core.recipients.get().toArray().join(',')
              const isCurrent = current === recent.join(',')
              const notMeNames = recent
                .filter(r => r !== me)
                .map(core.authors.getName)
                .join(', ')
              const className = isCurrent
                ? 'control-panel__users__item__active'
                : 'control-panel__users__item'
              return (
                <p
                  className={className}
                  onClick={() => this.handleRecentClick(recent)}
                  key={idx}
                >{notMeNames}</p>
              )
            })
            }
          </div>
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
  setPublic: bindActionCreators(Actions.setPublic, dispatch),
  setNotification: bindActionCreators(Actions.setNotification, dispatch),
  setError: bindActionCreators(Actions.setError, dispatch)
})

ControlPanel.propTypes = {
  setNotification: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setPrivate: PropTypes.func.isRequired,
  setPublic: PropTypes.func.isRequired,
  private: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
