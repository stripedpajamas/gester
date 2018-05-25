const post = require('./post')
const pub = require('./pub')
const whoami = require('./whoami')
const follow = require('./follow')
const about = require('./about')
const privatePost = require('./private')
const unbox = require('./unbox')

module.exports = {
  about,
  post,
  pub,
  follow,
  whoami,
  private: privatePost,
  unbox
}
