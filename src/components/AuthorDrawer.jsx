import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'

class AuthorDrawer extends Component {
  constructor () {
    super()

    this.startPrivateMessage = this.startPrivateMessage.bind(this)
    this.handleClickBlock = this.handleClickBlock.bind(this)
    this.handleClickFollow = this.handleClickFollow.bind(this)
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

  render () {
    const { authors, currentAuthorId, following, blocked } = this.props
    const author = (authors[currentAuthorId] || {}).name || currentAuthorId

    const isBlocked = blocked.includes(currentAuthorId)
    const areFollowing = following.includes(currentAuthorId)

    const blockText = isBlocked ? 'unblock' : 'block'
    const followText = areFollowing ? 'unfollow' : 'follow'
    return (
      <div className='author-drawer'>
        <span className='button-close' onClick={this.props.closeAuthorDrawer}>X</span>
        <div>
          <h1 className='author-drawer__header'>{author}</h1>
        </div>
        <div>
          <button
            className='button button-block'
            onClick={() => this.handleClickBlock(isBlocked, currentAuthorId)}
          >{blockText}</button>
          <button
            className='button button-follow'
            onClick={() => this.handleClickFollow(areFollowing, currentAuthorId)}
          >{followText}</button>
        </div>
        <div>
          <button className='button button-private' onClick={() => this.startPrivateMessage(author)}>start private</button>
        </div>

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
  unblock: PropTypes.func.isRequired

}

const mapStateToProps = state => ({
  currentAuthorId: state.currentAuthorId,
  authors: state.authors,
  following: state.following,
  blocked: state.blocked
})

const mapDispatchToProps = dispatch => ({
  closeAuthorDrawer: bindActionCreators(Actions.closeAuthorDrawer, dispatch),
  goPrivate: bindActionCreators(Actions.goPrivate, dispatch),
  follow: bindActionCreators(Actions.follow, dispatch),
  unfollow: bindActionCreators(Actions.unfollow, dispatch),
  block: bindActionCreators(Actions.block, dispatch),
  unblock: bindActionCreators(Actions.unblock, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthorDrawer)
