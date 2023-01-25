// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, screen } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { initializeTray } from "./tray";

let mainWindow: null | BrowserWindow = null;
let canvasWindow: null | BrowserWindow = null;
let canvasPassThrough = false;
// Prepare the renderer once the app is ready
const initMainWindow = ()=>{
    const { bounds } = screen.getPrimaryDisplay();
    const { height, width } = bounds;
    mainWindow = new BrowserWindow({
      y: height - 200,
      x: width / 2 - 400,
      width: 840,
      height: 50,
      vibrancy: "sidebar",
      transparent: true,
      frame: false,
      show: false,
      // kiosk:true,
      // movable:false,
      // alwaysOnTop:true,
      skipTaskbar:true,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        preload: join(__dirname, "preload.js"),
      },
    });

    const url = isDev
      ? "http://localhost:8000/"
      : format({
          pathname: join(__dirname, "../renderer/out/index.html"),
          protocol: "file:",
          slashes: true,
        });

    mainWindow.loadURL(url);
    mainWindow.webContents.openDevTools({ mode: "detach" });
    mainWindow.setContentProtection(true);
    mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow?.show();
    });
}
const initCanvasWindow = ()=>{
  const { bounds } = screen.getPrimaryDisplay();
  const { height, width } = bounds;
  canvasWindow = new BrowserWindow({
    title:"",
    width: width,
    height: height,
    transparent: true,
    frame: false,
    show: false,
    alwaysOnTop:true,
    // kiosk:true,
    // movable:false,
    skipTaskbar:true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/canvas"
    : format({
        pathname: join(__dirname, "../renderer/out/canvas.html"),
        protocol: "file:",
        slashes: true,
      });

  canvasWindow.loadURL(url);
  // canvasWindow.webContents.openDevTools({mode:"detach"});
  // canvasWindow.setContentProtection(true);
  canvasWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  canvasWindow.setIgnoreMouseEvents(canvasPassThrough, { forward: canvasPassThrough });
  canvasWindow.webContents.on("did-finish-load", () => {
    canvasWindow?.show();
  });
}

(async () => {
  await app.whenReady();
  await prepareNext("./renderer");
  initializeTray();
  initMainWindow();
  initCanvasWindow();
})();

export const toggleWindow = () =>{
  mainWindow?.isVisible() ? mainWindow?.hide() : mainWindow?.show();
}

export const togglePassThrough = ()=>{
 
  canvasPassThrough = canvasPassThrough ? false : true;
  canvasWindow?.setIgnoreMouseEvents(canvasPassThrough, { forward: canvasPassThrough });
}

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", message), 500);
});
