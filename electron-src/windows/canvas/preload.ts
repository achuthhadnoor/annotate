import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    invoke: (name: string, payload: any) => ipcRenderer.invoke(name, payload),
    send: (name: string, payload: any) => ipcRenderer.send(name, payload),
    on: (
      name: string,
      handler: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => ipcRenderer.on(name, handler),
    off: (name: string, handler: (...args: any[]) => void) =>
      ipcRenderer.off(name, handler),
    addEventListener: (name: string, handler: (...args: any[]) => void) =>
      ipcRenderer.addListener(name, handler),
    removeEventListener: (name: string, handler: (...args: any[]) => void) =>
      ipcRenderer.removeListener(name, handler),
  },
});
