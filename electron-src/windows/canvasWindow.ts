import { BrowserWindow, screen } from "electron";
import { is } from "electron-util";
import { join } from "path";
import { format } from "url";
import { windowManager } from "./windowManager";

let window: BrowserWindow | null = null;
let canvasPassThrough = false;

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
      preload: join(__dirname, "preload.js"),
    },
  });
  const url = is.development
    ? "http://localhost:8000/canvas"
    : format({
        pathname: join(__dirname, "../renderer/out/canvas.html"),
        protocol: "file:",
        slashes: true,
      });

  window.loadURL(url);
  window.webContents.openDevTools({ mode: "detach" });
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
const isCanvasOpen = () => true;
const toggleView = () => {};
const clickThrough = () => {
  canvasPassThrough = canvasPassThrough ? false : true;
  window?.setIgnoreMouseEvents(canvasPassThrough, {
    forward: canvasPassThrough,
  });
};
const closeAll = () => {};

export default windowManager.setCanvasWindow({
  open,
  isOpen: isCanvasOpen,
  toggleView,
  clickThrough,
  closeAll,
  close,
});
