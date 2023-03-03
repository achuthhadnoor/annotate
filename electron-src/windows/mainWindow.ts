import { BrowserWindow, screen } from "electron";
import { is } from "electron-util";
import { join } from "path";
import { format } from "url";
import { windowManager } from "./windowManager";

let window: BrowserWindow | null = null;

const open = () => {
  const { bounds } = screen.getPrimaryDisplay();
  const { height, width } = bounds;
  window = new BrowserWindow({
    y: height - 200,
    x: width / 2 - 450,
    width: 900,
    height: 50,
    vibrancy: "sidebar",
    transparent: true,
    frame: false,
    show: false,
    // kiosk: true,
    // fullscreenable: false,
    // fullscreen: false,
    hasShadow: false,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      preload: join(__dirname, "../preload.js"),
    },
  });
  const url = is.development
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  window.loadURL(url);
  is.development && window.webContents.openDevTools({ mode: "detach" });
  // window.setContentProtection(true);
  window.setAlwaysOnTop(true, "screen-saver", 1);
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.webContents.on("did-finish-load", () => {
    window?.show();
  });
};
const close = () => {
  window?.close();
};
const isOpen = () => true;
const toggleView = () => {
  window?.isVisible() ? window?.hide() : window?.show();
};

export default windowManager.setMainWindow({
  open,
  close,
  isOpen,
  toggleView,
});
