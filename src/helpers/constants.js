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
  JOIN_PUB: 'join_pub',
  SET_MY_NAME: 'set_my_name',
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

  // system messages
  PUB_JOIN_SUCCESS: 'Pub joined successfully',
  SET_MY_NAME_SUCCESS: 'Name set successfully',

  // error messages
  PUBLIC_SEND_FAILURE: 'Failed to post public message',
  PRIVATE_SEND_FAILURE: 'Failed to post private message',
  PRIVATE_RECIPIENTS_INVALID: 'Couldn\'t determine feed ids for all recipients',
  PUB_JOIN_FAILURE: 'Failed to join pub',
  SET_MY_NAME_FAILURE: 'Failed to set name',
  WHOAMI_FAILURE: 'Failed to get own id'
}
