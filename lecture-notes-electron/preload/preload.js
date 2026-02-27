const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  onNewProject: (callback) =>
    ipcRenderer.on("new-project", (_, data) => callback(data)),

  removeNewProjectListener: () => ipcRenderer.removeAllListeners("new-project"),

  onProjectOpened: (callback) =>
    ipcRenderer.on("project-opened", (_, data) => callback(data)),

  removeProjectOpenedListener: () =>
    ipcRenderer.removeAllListeners("project-opened"),

  onMenuSave: (callback) => ipcRenderer.on("menu-save", callback),

  removeMenuSaveListener: () => ipcRenderer.removeAllListeners("menu-save"),

  onMenuSaveAs: (callback) => ipcRenderer.on("menu-save-as", callback),

  removeMenuSaveAsListener: () =>
    ipcRenderer.removeAllListeners("menu-save-as"),

  saveToDisk: (data, saveAs = false) =>
    ipcRenderer.invoke("save-to-disk", { data, saveAs }),
});
