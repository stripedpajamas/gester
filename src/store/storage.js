import path from 'path'
import os from 'os'
import core from 'ssb-chat-core'
import storage from 'node-persist'

const configStorage = storage.create()
configStorage.initSync({
  dir: path.join(os.homedir(), core.constants.PROGRAM_DIR, 'config')
})

class Config {
  setConfig (key, val) {
    this.getConfig()
      .then((config) => {
        configStorage.setItem('gester-config', Object.assign(config || {}, {
          [key]: val
        }))
      })
  }
  getConfig () {
    return configStorage.getItem('gester-config')
  }
  getConfigSync () {
    return configStorage.getItemSync('gester-config')
  }
}

export default new Config()
