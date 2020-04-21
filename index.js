const { app,Menu, BrowserWindow } = require('electron')
const isMac = process.platform === 'darwin'
//主线程中实现
const template = [
    {
      label: "文件",
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '后退' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '后退' },
        { label: '前进' },
        { label: '剪切' },
        { label: '复制' },
        { label: '黏贴' }
      ]
    },
    // { role: 'viewMenu' }
    {
      label: '视图',
      submenu: [
        { role: '重新加载' },
        { role: '强制刷新' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: '窗口',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]
let dockMenu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(dockMenu);

function createWindow () {   
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 并且为你的应用加载index.html
  win.loadFile('index.html')

  // 打开开发者工具
  win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
