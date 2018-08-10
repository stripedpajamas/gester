import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as Actions from '../store/actions'

class ControlPanel extends Component {
  constructor () {
    super()
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleModeButton = this.handleModeButton.bind(this)
    this.handlePubButton = this.handlePubButton.bind(this)
    this.handlePubCancel = this.handlePubCancel.bind(this)
    this.handlePubSubmit = this.handlePubSubmit.bind(this)
    this.handleRecentClick = this.handleRecentClick.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseOverButton = this.handleMouseOverButton.bind(this)
    this.handleMouseLeaveButton = this.handleMouseLeaveButton.bind(this)
    this.handleRemoveRecent = this.handleRemoveRecent.bind(this)
    this.handleFocusPMInput = this.handleFocusPMInput.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)

    this.state = {
      closeIcon: null,
      closeIconHover: null,
      pmInputFocused: false
    }
  }

  handleFocusPMInput () {
    if (!this.state.pmInputFocused) {
      this.recipientsInput.focus()
      this.setState({ pmInputFocused: true })
      return true
    }
    return false
  }

  handleInputFocus () {
    this.setState({ pmInputFocused: true })
  }

  handleInputBlur () {
    this.setState({ pmInputFocused: false })
  }

  handleKeyDown (e) {
    if (e.key === 'Escape') {
      this.handleInputBlur()
      return
    }
    if (e.key === 'Enter') {
      if (!e.target.value) {
        this.props.goPublic()
        return
      }
      const recipients = e.target.value
        .split(',')
        .map(x => x.trim())
      this.recipientsInput.value = ''
      this.props.goPrivate(recipients)
      this.handleInputBlur()
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

  handleRemoveRecent (recipients) {
    this.props.removeRecent(recipients)
  }

  handleMouseOver (id) {
    this.setState({ closeIcon: id })
  }

  handleMouseLeave () {
    this.setState({ closeIcon: null })
  }

  handleMouseOverButton (id) {
    this.setState({ closeIconHover: id })
  }

  handleMouseLeaveButton () {
    this.setState({ closeIconHover: null })
  }

  render () {
    const privateMode = this.props.mode === 'PRIVATE'
    const sortedRecents = this.props.recents.slice().sort((a, b) => {
      const mappedA = a.filtered.map(id => (this.props.authors[id] || {}).name || id).join(', ')
      const mappedB = b.filtered.map(id => (this.props.authors[id] || {}).name || id).join(', ')
      return mappedA > mappedB
    })

    return (
      <div className='control-panel'>
        <div>
          <button className='button' onClick={this.handlePubButton}>+ join pub</button>
        </div>
        <div>
          <input
            className={`${this.state.pmInputFocused ? 'focused' : ''} control-panel__input`}
            type='text'
            placeholder='New private message...'
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            ref={el => { this.recipientsInput = el }}
          />
        </div>
        <div className='control-panel__users'>
          <div className='recents'>
            {sortedRecents.map((recent) => {
              const currentRecps = this.props.recipients.join(', ')
              const thisRecent = recent.filtered.join(', ')
              const isCurrent = currentRecps === thisRecent
              const isUnread = this.props.unreads.some((unread) => (
                unread.join(', ') === thisRecent
              ))

              const humanNames = recent.filtered.map(id => (
                (this.props.authors[id] || {}).name || id
              )).join(', ')

              let className = isCurrent
                ? 'recents-item__active'
                : 'recents-item'
              if (isUnread) {
                className += ' unread'
              }
              const wantingToClose = this.state.closeIconHover === thisRecent
              return (
                <div
                  className={className}
                  onMouseOver={() => this.handleMouseOver(thisRecent)}
                  onMouseLeave={this.handleMouseLeave}
                  key={thisRecent}
                >
                  <p onClick={() => this.handleRecentClick(humanNames)}>
                    {humanNames}
                  </p>
                  {this.state.closeIcon === thisRecent &&
                    <span
                      className='recents-remove-icon'
                      onMouseOver={() => this.handleMouseOverButton(thisRecent)}
                      onMouseLeave={this.handleMouseLeaveButton}
                      onClick={() => this.handleRemoveRecent(recent.raw)}
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className={wantingToClose ? 'hover' : ''}
                      />
                    </span>
                  }
                </div>
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
  authors: state.authors,
  unreads: state.unreads,
  recipients: state.recipients
})

const mapDispatchToProps = dispatch => ({
  goPrivate: bindActionCreators(Actions.goPrivate, dispatch),
  goPublic: bindActionCreators(Actions.goPublic, dispatch),
  joinPub: bindActionCreators(Actions.joinPub, dispatch),
  removeRecent: bindActionCreators(Actions.removeRecent, dispatch),
  setJoinPub: bindActionCreators(Actions.setJoinPub, dispatch)
})

ControlPanel.propTypes = {
  goPublic: PropTypes.func.isRequired,
  goPrivate: PropTypes.func.isRequired,
  joinPub: PropTypes.func.isRequired,
  setJoinPub: PropTypes.func.isRequired,
  recents: PropTypes.array.isRequired,
  authors: PropTypes.object.isRequired,
  unreads: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ControlPanel)
