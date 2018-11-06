import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getAuthorId } from '../store/util'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'
import Input from './Input'
import Recents from './Recents'
import AuthorView from './AuthorView'
import Modal from './Modal'

class ControlPanel extends Component {
  constructor () {
    super()
    this.handleInputSubmit = this.handleInputSubmit.bind(this)
    this.handleModeButton = this.handleModeButton.bind(this)
    this.handlePrivateButton = this.handlePrivateButton.bind(this)
    this.handleRecentClick = this.handleRecentClick.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseOverButton = this.handleMouseOverButton.bind(this)
    this.handleMouseLeaveButton = this.handleMouseLeaveButton.bind(this)
    this.handleRemoveRecent = this.handleRemoveRecent.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.startPrivateMessage = this.startPrivateMessage.bind(this)
    this.handleClickBlock = this.handleClickBlock.bind(this)
    this.handleClickFollow = this.handleClickFollow.bind(this)
    this.handleCancelPub = this.handleCancelPub.bind(this)
    this.handleJoinPub = this.handleJoinPub.bind(this)

    this.state = {
      closeIcon: null,
      closeIconHover: null,
      privateModalOpen: false
    }
  }

  handleInputSubmit (author) {
    const id = getAuthorId(author)
    console.log(author)
    this.props.openAuthorView(id)
  }

  startPrivateMessage (author) {
    if (author) {
      const recipients = author
        .split(',')
        .map(x => x.trim())
      this.props.goPrivate(recipients)
      this.props.closeAuthorView()
    } else {
      this.handleModeButton()
    }
    this.setState({ privateModalOpen: false })
  }

  handleBackButton () {
    this.props.closeAuthorView()
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

  handlePrivateButton () {
    if (!this.state.privateModalOpen) {
      this.setState({ privateModalOpen: true })
      return true
    }
    this.setState({ privateModalOpen: false })
    return false
  }

  handleCancelPub () {
    this.props.setJoinPub(false)
  }

  handleJoinPub (code) {
    this.props.joinPub(code)
    this.props.setJoinPub(false)
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
    const { authors, currentAuthorId, me, following, blocked, darkTheme } = this.props
    const author = authors[currentAuthorId] || currentAuthorId || authors[me] || me

    const isBlocked = blocked.includes(currentAuthorId)
    const areFollowing = following.includes(currentAuthorId)

    const blockText = isBlocked ? 'unblock' : 'block'
    const followText = areFollowing ? 'unfollow' : 'follow'

    return (
      <div className={`control-panel ${darkTheme ? 'control-panel--dark' : ''}`}>
        <div>
          <button className='button' onClick={this.handlePrivateButton}>new private</button>
        </div>
        <div>
          <Input
            className='control-panel__input'
            placeholder='Search for user'
            onSubmit={this.handleInputSubmit}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />
        </div>
        {!this.props.authorDrawerOpen
          ? (
            <Recents
              recents={this.props.recents}
              mode={this.props.mode}
              handleModeButton={this.handleModeButton}
              recipients={this.props.recipients}
              unreads={this.props.unreads}
              authors={this.props.authors}
              closeIconHover={this.state.closeIconHover}
              closeIcon={this.state.closeIcon}
              handleMouseOver={this.handleMouseOver}
              handleMouseLeave={this.handleMouseLeave}
              handleRecentClick={this.handleRecentClick}
              handleMouseOverButton={this.handleMouseOverButton}
              handleMouseLeaveButton={this.handleMouseLeaveButton}
              handleRemoveRecent={this.handleRemoveRecent}
            />
          )
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
              renameAuthor={this.props.renameAuthor}
            />
          )
        }
        {this.state.privateModalOpen && (
          <Modal
            text='start a private chat or press enter to go to public chat'
            inputText='enter private recipient(s) separated by commas'
            submitText='start'
            handleCancel={this.handlePrivateButton}
            handleSubmit={this.startPrivateMessage}
          />
        )}
        {this.props.joiningPub && (
          <Modal
            inputText='paste invite code here'
            handleCancel={this.handleCancelPub}
            handleSubmit={this.handleJoinPub}
          />
        )}
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
  me: state.me,
  joiningPub: state.joiningPub,
  darkTheme: state.darkTheme,
})

const mapDispatchToProps = dispatch => ({
  goPrivate: bindActionCreators(Actions.goPrivate, dispatch),
  goPublic: bindActionCreators(Actions.goPublic, dispatch),
  removeRecent: bindActionCreators(Actions.removeRecent, dispatch),
  openAuthorView: bindActionCreators(Actions.openAuthorView, dispatch),
  closeAuthorView: bindActionCreators(Actions.closeAuthorView, dispatch),
  follow: bindActionCreators(Actions.follow, dispatch),
  unfollow: bindActionCreators(Actions.unfollow, dispatch),
  block: bindActionCreators(Actions.block, dispatch),
  unblock: bindActionCreators(Actions.unblock, dispatch),
  setJoinPub: bindActionCreators(Actions.setJoinPub, dispatch),
  joinPub: bindActionCreators(Actions.joinPub, dispatch),
  renameAuthor: bindActionCreators(Actions.renameAuthor, dispatch)
})

ControlPanel.propTypes = {
  goPublic: PropTypes.func.isRequired,
  goPrivate: PropTypes.func.isRequired,
  recents: PropTypes.array.isRequired,
  authors: PropTypes.object.isRequired,
  unreads: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  following: PropTypes.array.isRequired,
  blocked: PropTypes.array.isRequired,
  authorDrawerOpen: PropTypes.bool.isRequired,
  openAuthorView: PropTypes.func.isRequired,
  closeAuthorView: PropTypes.func.isRequired,
  currentAuthorId: PropTypes.string.isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired,
  block: PropTypes.func.isRequired,
  unblock: PropTypes.func.isRequired,
  me: PropTypes.string.isRequired,
  joinPub: PropTypes.func.isRequired,
  setJoinPub: PropTypes.func.isRequired,
  renameAuthor: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ControlPanel)
