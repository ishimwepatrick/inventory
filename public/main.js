const { app, BrowserWindow, Menu, Notification, Tray  } = require('electron')

require('@electron/remote/main').initialize()
const path = require('path');
let appIcon = null;
let appOn = false;
const isDev = !app.isPackaged;
var loadingwindow = null;
function createWindow(){
    //create the browser window
    const win = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        center: true,
        webPreferences: {
            enableRemoteModule: true
        },
    })
    win.maximize()
    win.show()
    win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
    //loadingwindow.hide()

    win.on('closed', ()=>{
      appOn = false;
    })
}

app.whenReady().then(() => {
    //Menu.setApplicationMenu(null);
    setTimeout(()=>{createWindow()},3000)
    putInTray()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })

// app.on("ready" , () => {
//   loadingwindow = new BrowserWindow({
//     frame : false,
//     movable : false,
//     width: 420,
//     height: 420,
//   })
//   loadingwindow.loadFile("loading.gif")
// })

function putInTray() {
    const iconName = process.platform == 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
    const iconPath = path.join(__dirname, iconName)
    appIcon = new Tray(iconPath)
  
    const contextMenu = Menu.buildFromTemplate(
      [
        {
          label: 'Remove',
          click: () => {
            removeTray()
          }
        },
        {
          label: 'Exit',
          click: () => {
            closeApp()
          }
        }
      ])
  
    appIcon.setToolTip('Ubumwe Bwacu App.')
    appIcon.setContextMenu(contextMenu)
    appIcon.on('click', ()=>{
      if(!appOn){
        createWindow()
        appOn = true;
      }
    })
  }
  
  function removeTray(){
    appIcon.destroy()
  }
  
  function closeApp(){
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }
//Quit when all windows are closed
app.on('window-all-closed', ()=>{
    // On OS X it is common for application and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if(process.platform !== 'darwin'){
        closeApp()
    }
})

app.on('activate', ()=>{
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other window open.
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
})