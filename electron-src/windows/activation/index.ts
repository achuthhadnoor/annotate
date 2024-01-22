import { BrowserWindow, ipcMain } from "electron";
import { is } from "electron-util";
import { join } from "path";
import { format } from "url";
import { windowManager } from "../windowManager";
import { hostname } from "os";
import { settings } from "../../lib/settings";
import log from "../../lib/logger";

let window: BrowserWindow | null = null;
let isOpen = false;

const open = () => {
  window = new BrowserWindow({
    width: 300,
    height: 350,
    vibrancy: "sidebar",
    transparent: true,
    frame: false,
    show: false,
    hasShadow: false,
    alwaysOnTop: true,
    roundedCorners: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      preload: join(__dirname, "../../preload.js"),
    },
  });
  isOpen = true;
  const url = is.development
    ? "http://localhost:8000/onboard"
    : format({
        pathname: join(__dirname, "../../../renderer/out/onboard.html"),
        protocol: "file:",
        slashes: true,
      });

  window.loadURL(url);
  is.development && window.webContents.openDevTools({ mode: "detach" });
  window.webContents.on("did-finish-load", () => {
    window?.show();
  });
  return false;
};

const close = () => {
  window?.hide();
};

const isOnboardOpen = () => isOpen;

const validate = (email: string, key: string) => {
  console.log(email, key);
  return { isValid: true, message: " string" };
};

ipcMain.on("validate", async (event, { email, code }) => {
  log.info("activation =>", code, email);
  settings.set("user", { hostname: hostname(), email, code });
  event.reply("validation-status", { valid: true });
});

export default windowManager.setActivation({
  open,
  isOpen: isOnboardOpen,
  close,
  validate,
});
