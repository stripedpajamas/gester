import React from 'react'
import PropTypes from 'prop-types'

const Loader = (props) => (
  <div className={`loader ${props.small ? 'loader-small' : 'loader-large'}`}>
    <div className='loader-1' />
    <div className='loader-2' />
    <div className='loader-3' />
    <div className='loader-4' />
  </div>
)

Loader.propTypes = {
  small: PropTypes.bool
}

export default Loader
