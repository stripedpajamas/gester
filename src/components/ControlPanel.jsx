import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'

class ControlPanel extends Component {
  constructor () {
    super()
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleModeButton = this.handleModeButton.bind(this)
    this.handlePubButton = this.handlePubButton.bind(this)
    this.handlePubCancel = this.handlePubCancel.bind(this)
    this.handlePubSubmit = this.handlePubSubmit.bind(this)
    this.handleRecentClick = this.handleRecentClick.bind(this)
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      // this is a little to text based so we'll have to make it more fun
      const recipients = e.target.value
        .split(',')
        .map(x => x.trim())
      this.recipientsInput.value = ''
      this.props.goPrivate(recipients)
    }
  }

  handleModeButton () {
    this.props.goPublic()
  }

  handlePubButton () {
    this.props.setJoinPub(true)
  }

  handlePubCancel () {
    this.props.setJoinPub(false)
  }

  handlePubSubmit (invite) {
    this.props.joinPub(invite)
  }

  handleRecentClick (recipients) {
    this.props.goPrivate(recipients.split(', '))
  }

  render () {
    const privateMode = this.props.mode === 'PRIVATE'

    return (
      <div className='control-panel'>
        <div>
          <button className='button' onClick={this.handlePubButton}>+ join pub</button>
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
        <div className='control-panel__users'>
          <div className='recents'>
            {this.props.recents.map((recent, idx) => {
              const current = this.props.recipients.join(', ')
              const isCurrent = current === recent
              const className = isCurrent
                ? 'recents-item__active'
                : 'recents-item'
              return (
                <p
                  className={className}
                  onClick={() => this.handleRecentClick(recent)}
                  key={idx}
                >{recent}</p>
              )
            })}
          </div>
        </div>
        <div>
          {privateMode &&
            <button className='button public-button' onClick={this.handleModeButton}>back to public</button>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mode: state.mode,
  recents: state.recents,
  recipients: state.recipients
})

const mapDispatchToProps = dispatch => ({
  goPrivate: bindActionCreators(Actions.goPrivate, dispatch),
  goPublic: bindActionCreators(Actions.goPublic, dispatch),
  joinPub: bindActionCreators(Actions.joinPub, dispatch),
  setJoinPub: bindActionCreators(Actions.setJoinPub, dispatch)
})

ControlPanel.propTypes = {
  goPublic: PropTypes.func.isRequired,
  goPrivate: PropTypes.func.isRequired,
  joinPub: PropTypes.func.isRequired,
  setJoinPub: PropTypes.func.isRequired,
  recents: PropTypes.array,
  recipients: PropTypes.array,
  mode: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
