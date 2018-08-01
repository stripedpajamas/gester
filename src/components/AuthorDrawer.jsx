import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'

class AuthorDrawer extends Component {
  render () {
    return (
      <div className='author-drawer'>
        <span onClick={this.props.closeAuthorDrawer}>X</span>
      </div>
    )
  }
}

AuthorDrawer.propTypes = {
  closeAuthorDrawer: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  closeAuthorDrawer: bindActionCreators(Actions.closeAuthorDrawer, dispatch)
})

export default connect(null, mapDispatchToProps)(AuthorDrawer)
