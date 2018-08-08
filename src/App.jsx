import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from './store/actions'
import ControlPanel from './components/ControlPanel'
import JoinPubModal from './components/JoinPubModal'
import MessageView from './components/MessageView'
import MessageInput from './components/MessageInput'
import AuthorDrawer from './components/AuthorDrawer'
import Notification from './components/Notification'

class App extends Component {
  componentDidMount () {
    this.props.setupCore()
  }

  render () {
    const hasNotification = this.props.error || this.props.notification
    return (
      <div className={this.props.authorDrawerOpen ? 'main drawer-open' : 'main drawer-closed'}>
        {hasNotification &&
          <Notification
            error={this.props.error}
            notification={this.props.notification}
            onClose={this.props.clearNotification}
          />
        }
        {this.props.joiningPub &&
          <JoinPubModal />
        }
        <ControlPanel />
        <div className='message-view'>
          <MessageView />
          <MessageInput />
        </div>
        {this.props.authorDrawerOpen && <AuthorDrawer />}
      </div>
    )
  }
}

App.propTypes = {
  setupCore: PropTypes.func.isRequired,
  joiningPub: PropTypes.bool.isRequired,
  authorDrawerOpen: PropTypes.bool.isRequired,
  error: PropTypes.object,
  notification: PropTypes.string
}

const mapStateToProps = state => ({
  joiningPub: state.joiningPub,
  authorDrawerOpen: state.authorDrawerOpen,
  error: state.error,
  notification: state.notification
})

const mapDispatchToProps = dispatch => ({
  setupCore: bindActionCreators(Actions.setupCore, dispatch),
  clearNotification: bindActionCreators(Actions.clearNotification, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
