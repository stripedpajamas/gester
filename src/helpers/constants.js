module.exports = {
  // IPC stuff
  GENERIC_SBOT_IPC: 'sbot_message',
  SBOT_ME_IPC: 'sbot_me',
  SBOT_COMMAND: 'sbot_command',
  SYSTEM_MESSAGE: 'system_message',
  ERROR_MESSAGE: 'error_message',

  // sbot commands for IPC
  SEND_PUBLIC: 'send_public',
  SEND_PRIVATE: 'send_private',
  WHOAMI: 'whoami',

  // message types
  MESSAGE_TYPE: 'scat_message',
  ABOUT: 'about',
  CONTACT: 'contact',

  // ui stuff
  TIME_FORMAT: 'MMM DD HH:mm A',
  ME_GREEN: '#4CAF50',
  MODE: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  },

  // system and error messages
  PUBLIC_SEND_FAILURE: 'Failed to post public message',
  WHOAMI_FAILURE: 'Failed to get own id'
}
