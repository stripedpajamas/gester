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
  SET_YOUR_NAME: 'set_your_name',
  WHOAMI: 'whoami',
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow',

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
  SET_NAME_SUCCESS: 'Name set successfully',
  FOLLOW_SUCCESS: 'Followed successfully',
  UNFOLLOW_SUCCESS: 'Unfollowed successfully',
  USE_NAME_COMMAND: 'To identify yourself, use /name <name> or /nick <name>',

  // error messages
  PUBLIC_SEND_FAILURE: 'Failed to post public message',
  PRIVATE_SEND_FAILURE: 'Failed to post private message',
  PRIVATE_RECIPIENTS_INVALID: 'Couldn\'t determine feed ids for all recipients',
  PUB_JOIN_FAILURE: 'Failed to join pub',
  FOLLOW_FAILURE: 'Failed to follow',
  UNFOLLOW_FAILURE: 'Failed to unfollow',
  SET_NAME_FAILURE: 'Failed to set name',
  WHOIS_FAILURE: 'No id found',
  WHOAMI_FAILURE: 'Failed to get own id'
}
