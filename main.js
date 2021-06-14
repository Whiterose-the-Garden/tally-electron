// main.js

'use strict'
// console.log(__dirname);
// Import parts of electron to use
const { 
  app, 
  BrowserWindow,  
  ipcMain,
} = require('electron')
const path = require('path')
const url = require('url')
const Store = require('electron-store')
// Store.initRenderer()
const store = new Store();
store.clear()
store.set('habitDict', {'hello':{ streak:[]}})
// const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Keep a reference for dev mode
let dev = false

// Determine the mode (dev or production)
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true
}

// Temporary fix for broken high-dpi scale fctor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, // width of the window
    height: 768, // height of the window
    show: false, // don't show until window is ready
    webPreferences: {
      // nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  })

  // and load the index.html of the app.
  let indexPath

  // Determine the correct index.html file
  // (created by webpack) to load in dev and production
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  // Load the index.html
  mainWindow.loadURL(indexPath)

  // Don't show the app window until it is ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      // installExtension(REACT_DEVELOPER_TOOLS)
        // .catch(err => console.log('Error loading React DevTools: ', err))
      mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


const toHabitList = (habitDict) => {
  return Object.keys(habitDict)
    .reduce((acc, name) => {
      acc.push({
        name, 
        streak: habitDict[name].streak,
      })
      return acc
    }, [])
}

ipcMain.on('del', (e, name) => {
  console.log(name)
  const habitDict = store.get('habitDict')
  e.returnValue = (name in habitDict)
  if (name in habitDict) {
    delete habitDict[name]
    store.set('habitDict', habitDict)
  }
})

ipcMain.on('has', (e, name) => {
  console.log(name)
  const habitDict = store.get('habitDict')
  e.returnValue = (name in habitDict)
})

ipcMain.on('get', (e, name) => {
  console.log(name)
  const habitDict = store.get('habitDict')
  e.returnValue = habitDict[name]
})

ipcMain.on('getList', (e) => {
  const list = toHabitList(store.get('habitDict'))
  console.log(list)
  e.returnValue = list
})

ipcMain.on('set', (e, name) => {
  console.log(name)
  const habitDict = store.get('habitDict')
  habitDict[name] = {streak:[]}
  store.set('habitDict', habitDict)
  e.returnValue = true
})

ipcMain.on('add', (e, name) => {
  console.log(name)
  const habitDict = store.get('habitDict')
  habitDict[name] = {streak:[]}
  store.set('habitDict', habitDict)
  e.returnValue = true
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
