import React from 'react'
import PropTypes from 'prop-types'
import classNames from '@sindresorhus/class-names'

const Loader = (props) => {
  const { darkTheme } = props
  const classes = classNames(
    'loader',
    {
      'loader-small': props.small,
      'loader-large': props.large,
      'loader--dark': darkTheme
    }
  )
  return (
    <div className={classes}>
      <div className='loader-1' />
      <div className='loader-2' />
      <div className='loader-3' />
      <div className='loader-4' />
    </div>
  )
}

Loader.propTypes = {
  small: PropTypes.bool,
  darkTheme: PropTypes.bool
}

export default Loader
