import { BrowserWindow, screen } from "electron";
import { is } from "electron-util";
import { join } from "path";
import { format } from "url";
import { windowManager } from "../windowManager";
import log from "../../lib/logger";

let window: BrowserWindow | null = null;

const open = () => {
  const { bounds } = screen.getPrimaryDisplay();
  const { height, width } = bounds;
  console.log("yooo", join(__dirname, "./preload.js"));
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
      preload: join(__dirname, "./preload.js"),
    },
  });
  log.info("main url", MAIN_WINDOW_VITE_DEV_SERVER_URL);
  log.info(
    "main url",
    format({
      pathname: join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
      ),
      protocol: "file:",
      slashes: true,
    })
  );

  const url = MAIN_WINDOW_VITE_DEV_SERVER_URL
    ? MAIN_WINDOW_VITE_DEV_SERVER_URL
    : format({
        pathname: join(
          __dirname,
          `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
        ),
        protocol: "file:",
        slashes: true,
      });

  window.loadURL(url);
  is.development && window.webContents.openDevTools({ mode: "detach" });
  // window.setContentProtection(true);
  window.setAlwaysOnTop(true, "screen-saver", 2);
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.setHiddenInMissionControl(true);
  window.webContents.on("did-finish-load", () => {
    window?.show();
    windowManager.canvas?.open();
  });
};
const close = () => {
  window?.close();
};
const isOpen = () => true;
const toggleView = () => {
  window?.isVisible() ? window?.hide() : window?.show();
  windowManager.canvas?.toggleVisibility();
};

export default windowManager.setToolbar({
  open,
  close,
  isOpen,
  toggleView,
});
