import { BrowserWindow } from "electron";
import { is } from "electron-util";
import { join } from "path";
import { format } from "url";
import { windowManager } from "./windowManager";

let window: BrowserWindow | null = null;
let isFeedbackOpen = false;

const open = () => {
  if (isFeedbackOpen) {
    window?.show();
    return;
  }
  isFeedbackOpen = true;
  window = new BrowserWindow({
    width: 200,
    height: 200,
    vibrancy: "sidebar",
    transparent: true,
    frame: false,
    show: false,
    // kiosk: true,
    // fullscreenable: false,
    // fullscreen: false,
    // skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "../preload"),
    },
  });
  const url = is.development
    ? "http://localhost:8000/feedback"
    : format({
        pathname: join(__dirname, "../../renderer/out/feedback.html"),
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

const isOpen = () => isFeedbackOpen;

export default windowManager.setFeedbackWindow({
  open,
  close,
  isOpen,
});
