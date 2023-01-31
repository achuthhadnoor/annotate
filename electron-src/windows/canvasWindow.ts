import { BrowserWindow, ipcMain, screen } from "electron";
import { is } from "electron-util";
import { join } from "path";
import { format } from "url";
import { windowManager } from "./windowManager";

let window: BrowserWindow | null = null;
let canvasPassThrough = false;
let isOpen = false;
const open = () => {
  const { bounds } = screen.getPrimaryDisplay();
  const { height, width } = bounds;
  window = new BrowserWindow({
    title: "",
    width: width,
    height: height,
    transparent: true,
    frame: false,
    show: false,
    alwaysOnTop: true,
    // kiosk:true,
    // movable:false,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "../preload"),
    },
  });
  isOpen = true;
  const url = is.development
    ? "http://localhost:8000/canvas"
    : format({
        pathname: join(__dirname, "../../renderer/out/canvas.html"),
        protocol: "file:",
        slashes: true,
      });

  window.loadURL(url);
  is.development && window.webContents.openDevTools({ mode: "detach" });
  // window.setContentProtection(true);
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.setIgnoreMouseEvents(canvasPassThrough, {
    forward: canvasPassThrough,
  });
  window.webContents.on("did-finish-load", () => {
    window?.show();
  });
};
const close = () => {};
const isCanvasOpen = () => isOpen;
const toggleView = () => {
  isOpen ? window?.hide() : window?.show();
  isOpen = !isOpen;
};
const clickThrough = () => {
  canvasPassThrough = canvasPassThrough ? false : true;
  window?.setIgnoreMouseEvents(canvasPassThrough, {
    forward: canvasPassThrough,
  });
  // hide window to fix the bug for canvas draw
  // canvasPassThrough ? window?.show() : window?.hide();
};
const closeAll = () => {};

ipcMain.on("toggle-passthrough", () => {
  clickThrough();
});

export default windowManager.setCanvasWindow({
  open,
  isOpen: isCanvasOpen,
  toggleView,
  clickThrough,
  closeAll,
  close,
});
