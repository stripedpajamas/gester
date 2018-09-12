import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class AuthorView extends Component {
  constructor () {
    super()

    this.handleNameClick = this.handleNameClick.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleNameSet = this.handleNameSet.bind(this)

    this.state = {
      newName: '',
      inEditMode: false
    }
  }

  handleNameClick () {
    this.setState({
      inEditMode: true,
      newName: this.props.author
    })
  }

  handleNameChange (e) {
    this.setState({ newName: e.target.value })
  }

  handleNameSet (e) {
    if (e.key === 'Enter') {
      this.props.renameAuthor(this.props.currentAuthorId, this.state.newName)
        .then(() => {
          this.setState({
            inEditMode: false,
            newName: ''
          })
        })
    } else if (e.key === 'Escape') {
      this.setState({ inEditMode: false })
    }
  }

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
          {this.state.inEditMode
            ? (
              <input
                autoFocus
                className='author-view__change'
                value={this.state.newName}
                onChange={this.handleNameChange}
                onKeyUp={this.handleNameSet}
              />
            )
            : (
              <h1 className='author-view__header' onDoubleClick={this.handleNameClick}>{this.props.author}</h1>
            )
          }
          <h2 id='author-id'>{this.props.currentAuthorId || this.props.me}</h2>
        </div>
        <div className='author-view__actions'>
          <button
            className='author-view__button'
            id='button-private'
            onClick={() => this.props.startPrivateMessage(this.props.author)}
          >direct message</button>
          <button
            className='author-view__button'
            id='button-follow'
            disabled={buttonDisabled}
            onClick={() => this.props.handleClickFollow(this.props.areFollowing, this.props.currentAuthorId)}
          >{this.props.followText}</button>
          <button
            className='author-view__button'
            id='button-block'
            disabled={buttonDisabled}
            onClick={() => this.props.handleClickBlock(this.props.isBlocked, this.props.currentAuthorId)}
          >{this.props.blockText}</button>
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
  currentAuthorId: PropTypes.string.isRequired,
  renameAuthor: PropTypes.func.isRequired
}

export default AuthorView
