#!/usr/bin/env node
import path from 'path'
import { app, BrowserWindow, ipcMain, shell, Menu } from 'electron'
import defaultMenu from 'electron-default-menu'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer'

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

  // set up help menu
  createMenu(mainWindow)

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
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    loaderWindow.close()
  })
}

const createMenu = (win) => {
  const contents = win.webContents
  // Get template for default menu
  const menu = defaultMenu(app, shell)

  // add join pub in help menu
  const help = menu.find(x => x.label === 'Help')
  help.submenu = [
    {
      label: 'Join Pub',
      click: () => {
        contents.send('joining-pub')
      }
    },
    {
      label: 'Learn More',
      click: () => {
        shell.openExternal('https://github.com/stripedpajamas/gester')
      }
    }
  ]

  // Set top-level application menu, using modified template
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}

app.on('ready', () => {
  createWindows()
})

app.on('browser-window-focus', () => {
  if (mainWindow) {
    mainWindow.webContents.send('main-focused')
  }
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
  } else if (!mainWindow.isVisible()) {
    mainWindow.show()
  }
})

const quit = () => {
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
