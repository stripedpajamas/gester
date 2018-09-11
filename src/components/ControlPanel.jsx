import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getAuthorId } from '../store/util'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as Actions from '../store/actions'
import Input from './Input'
import AuthorView from './AuthorView'

class ControlPanel extends Component {
  constructor () {
    super()
    this.handleInputSubmit = this.handleInputSubmit.bind(this)
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
    this.handleBackButton = this.handleBackButton.bind(this)
    this.startPrivateMessage = this.startPrivateMessage.bind(this)
    this.handleClickBlock = this.handleClickBlock.bind(this)
    this.handleClickFollow = this.handleClickFollow.bind(this)

    this.state = {
      closeIcon: null,
      closeIconHover: null,
      pmInputFocused: false
    }
  }

  handleFocusPMInput () {
    if (!this.state.pmInputFocused) {
      this.recipientsInput.handleFocusInput()
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

  handleInputSubmit (author) {
    const id = getAuthorId(author)
    this.props.openAuthorDrawer(id)
  }

  startPrivateMessage (author) {
    const recipient = [author]
    this.props.goPrivate(recipient)
    this.props.closeAuthorDrawer()
  }

  handleBackButton () {
    this.props.closeAuthorDrawer()
  }

  handleClickBlock (blocked, id) {
    if (blocked) {
      return this.props.unblock(id)
    }

    return this.props.block(id)
  }

  handleClickFollow (followed, id) {
    if (followed) {
      return this.props.unfollow(id)
    }

    return this.props.follow(id)
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
    const sortedRecents = this.props.recents.slice().sort((a, b) => {
      const mappedA = a.filtered.map(id => this.props.authors[id] || id).join(', ')
      const mappedB = b.filtered.map(id => this.props.authors[id] || id).join(', ')
      return mappedA > mappedB
    })
    const { authors, currentAuthorId, me, following, blocked } = this.props
    const author = authors[currentAuthorId] || currentAuthorId || authors[me] || me

    const isBlocked = blocked.includes(currentAuthorId)
    const areFollowing = following.includes(currentAuthorId)

    const blockText = isBlocked ? 'unblock' : 'block'
    const followText = areFollowing ? 'unfollow' : 'follow'

    return (
      <div className='control-panel'>
        <div>
          <button className='button' onClick={this.handlePubButton}>start private</button>
        </div>
        <div>
          <Input
            className='control-panel__input'
            placeholder='Search For User'
            onSubmit={this.handleInputSubmit}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            ref={el => { this.recipientsInput = el }}
          />
        </div>
        {!this.props.authorDrawerOpen
          ? (<div className='control-panel__users'>
            <div className='recents'>
              {this.props.mode === 'PRIVATE'
                ? (
                  <div className='recents-item' onClick={this.handleModeButton}>
                    <p>#public</p>
                  </div>
                )
                : (
                  <div className='recents-item'>
                    <p>#public</p>
                  </div>
                )
              }
              {sortedRecents.map((recent) => {
                const currentRecps = this.props.recipients.join(', ')
                const thisRecent = recent.filtered.join(', ')
                const isCurrent = currentRecps === thisRecent
                const isUnread = this.props.unreads.some((unread) => (
                  unread.join(', ') === thisRecent
                ))

                const humanNames = recent.filtered.map(id => (this.props.authors[id] || id)).join(', ')

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
          </div>)
          : (
            <AuthorView
              isBlocked={isBlocked}
              areFollowing={areFollowing}
              blockText={blockText}
              followText={followText}
              author={author}
              me={me}
              currentAuthorId={currentAuthorId}
              handleBackButton={this.handleBackButton}
              handleClickBlock={this.handleClickBlock}
              handleClickFollow={this.handleClickFollow}
              startPrivateMessage={this.startPrivateMessage}
            />
          )
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mode: state.mode,
  recents: state.recents,
  authors: state.authors,
  following: state.following,
  blocked: state.blocked,
  unreads: state.unreads,
  recipients: state.recipients,
  authorDrawerOpen: state.authorDrawerOpen,
  currentAuthorId: state.currentAuthorId,
  me: state.me
})

const mapDispatchToProps = dispatch => ({
  goPrivate: bindActionCreators(Actions.goPrivate, dispatch),
  goPublic: bindActionCreators(Actions.goPublic, dispatch),
  joinPub: bindActionCreators(Actions.joinPub, dispatch),
  removeRecent: bindActionCreators(Actions.removeRecent, dispatch),
  setJoinPub: bindActionCreators(Actions.setJoinPub, dispatch),
  openAuthorDrawer: bindActionCreators(Actions.openAuthorDrawer, dispatch),
  closeAuthorDrawer: bindActionCreators(Actions.closeAuthorDrawer, dispatch),
  follow: bindActionCreators(Actions.follow, dispatch),
  unfollow: bindActionCreators(Actions.unfollow, dispatch),
  block: bindActionCreators(Actions.block, dispatch),
  unblock: bindActionCreators(Actions.unblock, dispatch)
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
  mode: PropTypes.string.isRequired,
  following: PropTypes.array.isRequired,
  blocked: PropTypes.array.isRequired,
  authorDrawerOpen: PropTypes.bool.isRequired,
  openAuthorDrawer: PropTypes.func.isRequired,
  closeAuthorDrawer: PropTypes.func.isRequired,
  currentAuthorId: PropTypes.string.isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired,
  block: PropTypes.func.isRequired,
  unblock: PropTypes.func.isRequired,
  me: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ControlPanel)
