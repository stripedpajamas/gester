import { app, BrowserWindow, ipcMain } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { enableLiveReload } from 'electron-compile'
import pull from 'pull-stream'
import { setClient } from './helpers/client'
import party from './ssb-party'
import Processor from './helpers/processor'
import * as Constants from './helpers/constants'

process.on('uncaughtException', () => {
  console.log('Uncaught exception :(')
  process.exit(1)
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let processor
let client
let willQuitApp

const isDevMode = process.execPath.match(/[\\/]electron/)

// if (isDevMode) enableLiveReload()

const createWindows = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(VUEJS_DEVTOOLS)
    // mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.on('did-finish-load', () => {
    processor = new Processor(mainWindow.webContents)
    startServer()
  })

  mainWindow.on('close', (e) => {
    if (willQuitApp) {
      /* the user tried to quit the app */
      mainWindow = null
      quit()
    } else {
      /* the user only tried to close the window */
      e.preventDefault()
      mainWindow.hide()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindows()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    quit()
  }
})

app.on('before-quit', () => { willQuitApp = true })
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindows()
  }
})

const quit = () => {
  try {
    client && client.control && typeof client.control.stop === 'function' && client.control.stop()
  } catch (e) {}
  app.quit()
}

const hr = 60 * 60 * 1000
const since = Date.now() - (7 * 24 * hr) // 1 week of data

const startServer = () => {
  const opts = { timers: { keepalive: 10 } } // party: { out: false, err: false }
  party(opts, (err, sbot) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }

    // set global sbot instance
    client = sbot
    setClient(client)

    // set me
    processor.processMe(sbot.id)

    // start streaming abouts
    pull(
      // don't limit the about messages to a week because we want identifiers
      sbot.messagesByType({ type: Constants.ABOUT, live: true }),
      pull.drain((msg) => processor.processMsg(msg))
    )

    // start streaming messages
    pull(
      sbot.messagesByType({ type: Constants.MESSAGE_TYPE, live: true, gt: since }),
      pull.drain((msg) => processor.processMsg(msg))
    )
  })
}

ipcMain.on(Constants.SBOT_COMMAND, (_, data) => processor.processSbotCommand(data))
