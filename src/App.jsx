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

class App extends Component {
  componentDidMount () {
    this.props.setupCore()
  }

  render () {
    return (
      <div className={this.props.authorDrawerOpen ? 'main drawer-open' : 'main drawer-closed'}>
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
  authorDrawerOpen: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  joiningPub: state.joiningPub,
  authorDrawerOpen: state.authorDrawerOpen
})

const mapDispatchToProps = dispatch => ({
  setupCore: bindActionCreators(Actions.setupCore, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
