const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('billAPI', {
  createShortLink: (url, title) => ipcRenderer.invoke('create-short-link', { url, title }),
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
  getRemainingCount: () => ipcRenderer.invoke('get-remaining-count')
});
