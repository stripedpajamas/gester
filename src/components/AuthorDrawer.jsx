import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Input from './Input'
import { getAuthorId } from '../store/util'
import * as Actions from '../store/actions'

class AuthorDrawer extends Component {
  constructor () {
    super()

    this.startPrivateMessage = this.startPrivateMessage.bind(this)
    this.handleClickBlock = this.handleClickBlock.bind(this)
    this.handleClickFollow = this.handleClickFollow.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleInputSubmit = this.handleInputSubmit.bind(this)
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

  handleOpen (id) {
    this.props.openAuthorDrawer(id)
  }

  handleClose () {
    this.props.closeAuthorDrawer()
  }

  render () {
    const { authors, currentAuthorId, following, blocked, me } = this.props
    const author = (authors[currentAuthorId] || {}).name || currentAuthorId || (authors[me] || {}).name || me

    const isBlocked = blocked.includes(currentAuthorId)
    const areFollowing = following.includes(currentAuthorId)

    const blockText = isBlocked ? 'unblock' : 'block'
    const followText = areFollowing ? 'unfollow' : 'follow'
    return (
      <div className='author-drawer'>
        {!this.props.authorDrawerOpen &&
          <div className='author-drawer__toggle'>
            <button className='toggle-arrow' onClick={() => this.handleOpen(currentAuthorId)}>
              <FontAwesomeIcon
                icon={faArrowLeft}
              />
            </button>
          </div>
        }
        {this.props.authorDrawerOpen &&
          <div className='author-drawer__content'>
            <div className='toggle'>
              <button className='toggle-arrow' onClick={() => this.handleClose()}>
                <FontAwesomeIcon
                  icon={faArrowRight}
                />
              </button>
            </div>
            <div>
              <Input
                onSubmit={this.handleInputSubmit}
                placeholder='Search for user'
              />
            </div>
            <div>
              <h1 className='author-drawer__header'>{author}</h1>
              <h2 id='author-id'>{currentAuthorId || me}</h2>
            </div>
            <div>
              <button
                className='button'
                id='button-block'
                onClick={() => this.handleClickBlock(isBlocked, currentAuthorId)}
                disabled={author === authors[me].name}
              >{blockText}</button>
              <button
                className='button'
                id='button-follow'
                onClick={() => this.handleClickFollow(areFollowing, currentAuthorId)}
                disabled={author === authors[me].name}
              >{followText}</button>
            </div>
            <div>
              <button
                className='button'
                id='button-private'
                onClick={() => this.startPrivateMessage(author)}
              >start private</button>
            </div>
          </div>
        }
      </div>
    )
  }
}

AuthorDrawer.propTypes = {
  closeAuthorDrawer: PropTypes.func.isRequired,
  goPrivate: PropTypes.func.isRequired,
  currentAuthorId: PropTypes.string.isRequired,
  authors: PropTypes.objectOf(PropTypes.object).isRequired,
  following: PropTypes.arrayOf(PropTypes.string).isRequired,
  blocked: PropTypes.arrayOf(PropTypes.string).isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired,
  block: PropTypes.func.isRequired,
  unblock: PropTypes.func.isRequired,
  authorDrawerOpen: PropTypes.bool.isRequired,
  me: PropTypes.string.isRequired

}

const mapStateToProps = state => ({
  currentAuthorId: state.currentAuthorId,
  authors: state.authors,
  following: state.following,
  blocked: state.blocked,
  authorDrawerOpen: state.authorDrawerOpen,
  me: state.me
})

const mapDispatchToProps = dispatch => ({
  closeAuthorDrawer: bindActionCreators(Actions.closeAuthorDrawer, dispatch),
  openAuthorDrawer: bindActionCreators(Actions.openAuthorDrawer, dispatch),
  goPrivate: bindActionCreators(Actions.goPrivate, dispatch),
  follow: bindActionCreators(Actions.follow, dispatch),
  unfollow: bindActionCreators(Actions.unfollow, dispatch),
  block: bindActionCreators(Actions.block, dispatch),
  unblock: bindActionCreators(Actions.unblock, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthorDrawer)
