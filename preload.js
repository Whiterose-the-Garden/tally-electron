const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('store', {
  add: (name) => {
    ipcRenderer.sendSync('add', name)
  },
  'set': (name) => {
    ipcRenderer.sendSync('set', name)
  },
  del: (habit) => {
    return ipcRenderer.sendSync('del', name)
  },
  has: (name) => {
    return ipcRenderer.sendSync('has', name)
  },
  getList: () => {
    return ipcRenderer.sendSync('getList')
  },
  'get': (name) => {
    return ipcRenderer.sendSync('get', name)
  }
})
