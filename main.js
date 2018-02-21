// Modules
const {app, BrowserWindow, shell} = require('electron')
const windowStateKeeper = require('electron-window-state')
const appMenu = require('./menu')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Create the main BrowserWindow
const createWindow = () => {

  // Add main menu to app
  appMenu.create()

  // Load the previous state with fallback to defaults
  let winState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })

  // Create the window using the state information
  win = new BrowserWindow({
    x: winState.x,
    y: winState.y,
    width: winState.width,
    height: winState.height,
    backgroundColor: '#E8E8E8',
    title: 'Google Keep'
  })

  // Open the DevTools.
  // win.webContents.openDevTools()

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  winState.manage(win)

  // Emitted when the window is closed.
  win.on('closed', () => win = null )

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow)

// On OS X re-create a window when the dock icon is clicked
// and there are no other windows open.
app.on('activate', () => {
  if (win === null) createWindow()
})

// Open url externally if not "keep.google.com"
const openExternal = (e, url) => {
  if ( !url.includes('keep.google.com') ) {
    e.preventDefault()
    shell.openExternal(url)
  }
}

// Listen for web contents being rendered
app.on('web-contents-created', (e, contents) => {

  // Check for webview (keep.google.com)
  if (contents.getType() == 'webview') {

    // Listen for any navigation or new window events
    contents.on('will-navigate', openExternal)
    contents.on('new-window', openExternal)
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {

  // On OS X stay active until the user quits explicitly
  if (process.platform !== 'darwin') app.quit()
})
