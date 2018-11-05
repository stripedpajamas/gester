import React from 'react'
import PropTypes from 'prop-types'

const Loader = (props) => {
  const { darkTheme } = props
  const classes = ['loader']
  if (props.small) {
    classes.push('loader-small')
  } else {
    classes.push('loader-large')
  }
  if (darkTheme) {
    classes.push('loader--dark')
  }
  return (
    <div className={classes.join(' ')}>
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
