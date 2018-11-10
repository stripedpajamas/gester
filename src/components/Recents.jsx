import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

class Recents extends Component {
  render () {
    const sortedRecents = this.props.recents.slice().sort((a, b) => {
      const mappedA = a.filtered.map(id => this.props.authors[id] || id).join(', ')
      const mappedB = b.filtered.map(id => this.props.authors[id] || id).join(', ')
      return mappedA > mappedB
    })

    return (
      <div className='control-panel__users'>
        <div className='recents'>
          {this.props.mode === 'PRIVATE'
            ? (
              <div className='recents-item' onClick={this.props.handleModeButton}>
                <p>#public</p>
              </div>
            )
            : (
              <div className='recents-item--active'>
                <p>#public</p>
              </div>
            )
          }
          {sortedRecents.map((recent) => {
            const currentRecps = this.props.recipients.join(', ')
            const thisRecent = recent.filtered.join(', ')
            const isCurrent = currentRecps === thisRecent
            const isUnread = this.props.unreads.some((unread) => (
              unread.join(', ') === thisRecent
            ))

            const humanNames = recent.filtered.map(id => (this.props.authors[id] || id)).join(', ')

            let className = isCurrent
              ? 'recents-item--active'
              : 'recents-item'
            if (isUnread) {
              className += ' unread'
            }
            const wantingToClose = this.props.closeIconHover === thisRecent
            return (
              <div
                className={className}
                onMouseOver={() => this.props.handleMouseOver(thisRecent)}
                onMouseLeave={this.props.handleMouseLeave}
                key={thisRecent}
              >
                <p onClick={() => this.props.handleRecentClick(humanNames)}>
                  {humanNames}
                </p>
                {this.props.closeIcon === thisRecent &&
                  <span
                    className='recents-remove-icon'
                    onMouseOver={() => this.props.handleMouseOverButton(thisRecent)}
                    onMouseLeave={this.props.handleMouseLeaveButton}
                    onClick={() => this.props.handleRemoveRecent(recent.raw)}
                  >
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className={wantingToClose ? 'hover' : ''}
                    />
                  </span>
                }
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

Recents.propTypes = {
  recents: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  handleModeButton: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired,
  unreads: PropTypes.array.isRequired,
  authors: PropTypes.object.isRequired,
  closeIconHover: PropTypes.string,
  closeIcon: PropTypes.string,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  handleRecentClick: PropTypes.func.isRequired,
  handleMouseOverButton: PropTypes.func.isRequired,
  handleMouseLeaveButton: PropTypes.func.isRequired,
  handleRemoveRecent: PropTypes.func.isRequired
}

export default Recents
