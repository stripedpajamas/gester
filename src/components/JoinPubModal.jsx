import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'

class JoinPubModal extends Component {
  constructor (props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleKeyPress (e) {
    if (e.key === 'Escape') {
      this.props.onCancel()
    }
    if (e.key === 'Enter') {
      const inviteCode = e.target.value
      this.props.onSubmit(inviteCode)
      this.pubInput.value = ''
    }
  }

  handleSubmit () {
    const inviteCode = this.pubInput.value
    this.props.joinPub(inviteCode)
    this.pubInput.value = ''
    this.props.setJoinPub(false)
  }

  handleCancel () {
    this.props.setJoinPub(false)
  }

  render () {
    return (
      <div>
        <div className='join-pub modal'>
          <div>
            <input
              className='modal-input'
              type='text'
              placeholder={`Paste pub invite code here...`}
              onKeyPress={this.handleKeyPress}
              onChange={this.handleChange}
              ref={el => { this.pubInput = el }}
            />
          </div>
          <div>
            <button className='modal-button button' onClick={this.handleCancel}>cancel</button>
            <button className='join-button button' onClick={this.handleSubmit}>join</button>
          </div>
        </div>
        <div className='modal-overlay' onClick={this.handleCancel} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  joiningPub: state.joiningPub
})

const mapDispatchToProps = dispatch => ({
  joinPub: bindActionCreators(Actions.joinPub, dispatch),
  setJoinPub: bindActionCreators(Actions.setJoinPub, dispatch)
})

JoinPubModal.propTypes = {
  joinPub: PropTypes.func.isRequired,
  setJoinPub: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinPubModal)
