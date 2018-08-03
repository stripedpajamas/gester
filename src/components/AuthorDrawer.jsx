import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'

class AuthorDrawer extends Component {
  constructor () {
    super()

    this.startPrivateMessage = this.startPrivateMessage.bind(this)
  }

  startPrivateMessage (e, author) {
    e.preventDefault()
    const recipient = [author]
    this.props.goPrivate(recipient)
    this.props.closeAuthorDrawer()
  }

  render () {
    const { authors, currentAuthorId } = this.props
    const author = (authors[currentAuthorId] || {}).name || currentAuthorId
    console.log(authors[currentAuthorId])
    return (
      <div className='author-drawer'>
        <span className='button-close' onClick={this.props.closeAuthorDrawer}>X</span>
        <div>
          <h1 className='author-drawer__header'>{author}</h1>
        </div>
        <div>
          <button className='button button-block'>block</button>
          <button className='button button-follow'>follow</button>
        </div>
        <div>
          <button className='button button-private' onClick={(e) => this.startPrivateMessage(e, author)}>start private</button>
        </div>

      </div>
    )
  }
}

AuthorDrawer.propTypes = {
  closeAuthorDrawer: PropTypes.func.isRequired,
  goPrivate: PropTypes.func.isRequired,
  currentAuthorId: PropTypes.string.isRequired,
  authors: PropTypes.objectOf(PropTypes.object).isRequired
}

const mapStateToProps = state => ({
  currentAuthorId: state.currentAuthorId,
  authors: state.authors
})

const mapDispatchToProps = dispatch => ({
  closeAuthorDrawer: bindActionCreators(Actions.closeAuthorDrawer, dispatch),
  goPrivate: bindActionCreators(Actions.goPrivate, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthorDrawer)
