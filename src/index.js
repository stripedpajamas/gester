#!/usr/bin/env node
import path from 'path'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer'
const core = require('ssb-chat-core')

global.core = core

process.on('uncaughtException', (e) => {
  console.log(e)
  core.stop()
  process.exit(1)
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let loaderWindow
let willQuitApp

global.getMain = () => mainWindow

const isDevMode = process.execPath.match(/[\\/]electron/)

const createWindows = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    icon: path.join(__dirname, 'styles/gester.png')
  })
  loaderWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'styles/gester.png')
  })
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  loaderWindow.loadURL(`file://${__dirname}/loader.html`)

  if (isDevMode) {
    try {
      await installExtension(REACT_DEVELOPER_TOOLS)
      await installExtension(REDUX_DEVTOOLS)
    } catch (e) {
      console.log(e)
    }
  }

  mainWindow.webContents.on('will-navigate', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
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
  mainWindow.on('focus', () => {
    ipcMain.emit('main-focused')
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    loaderWindow.close()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  core.start({ debug: true, timeWindow: 1209600000 }, (err) => {
    if (err) {
      console.log(err)
      quit()
      process.exit(1)
    }
    createWindows()
  })
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
  core.stop()
  app.quit()
}

const setBadge = (show) => {
  if (app && app.dock) {
    if (show) {
      app.dock.setBadge('\u2022') // bullet symbol
    } else {
      app.dock.setBadge('')
    }
  }
}

ipcMain.on('unread', (_, badge) => setBadge(badge))
