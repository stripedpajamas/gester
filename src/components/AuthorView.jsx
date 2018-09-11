import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class AuthorView extends Component {
  render () {
    const buttonDisabled = this.props.currentAuthorId === this.props.me
    return (
      <div className='author-view'>
        <div>
          <FontAwesomeIcon
            className='author-view__back'
            icon={faArrowLeft}
            onClick={this.props.handleBackButton}
          />
        </div>
        <div>
          <h1 className='author-view__header'>{this.props.author}</h1>
          <h2 id='author-id'>{this.props.currentAuthorId || this.props.me}</h2>
        </div>
        <div className='author-view__actions'>
          <button
            className='button'
            id='button-block'
            disabled={buttonDisabled}
            onClick={() => this.props.handleClickBlock(this.props.isBlocked, this.props.currentAuthorId)}
          >{this.props.blockText}</button>
          <button
            className='button'
            id='button-follow'
            disabled={buttonDisabled}
            onClick={() => this.props.handleClickFollow(this.props.areFollowing, this.props.currentAuthorId)}
          >{this.props.followText}</button>
          <button
            className='button'
            id='button-private'
            onClick={() => this.props.startPrivateMessage(this.props.author)}
          >start private</button>
        </div>
      </div>
    )
  }
}

AuthorView.propTypes = {
  isBlocked: PropTypes.bool.isRequired,
  areFollowing: PropTypes.bool.isRequired,
  blockText: PropTypes.string.isRequired,
  followText: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  me: PropTypes.string.isRequired,
  currentAuthorId: PropTypes.string.isRequired
}

export default AuthorView
