import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class PrivatePanel extends Component {
  render () {
    if (!this.props.privatePanel) {
      return null
    }
    return (
      <div className='private'>chive</div>
    )
  }
}

const mapStateToProps = state => ({
  privatePanel: state.privatePanel
})

PrivatePanel.propTypes = {
  privatePanel: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, null)(PrivatePanel)
