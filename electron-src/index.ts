import { app, globalShortcut, ipcMain } from "electron";
import prepareNext from "electron-next";
import log from "./lib/logger";
import { windowManager } from "./windows/windowManager";
import "./windows/load";
import { settings } from "./lib/settings";
import { initializeTray } from "./tray";
app.commandLine.appendSwitch("disable-features", "CrossOriginOpenerPolicy");
app.whenReady().then(async () => {
  try {
    await prepareNext("./renderer");
    log.info("✨ nextjs loaded");
  } catch (error) {
    log.info("=============");
    log.error(error);
    log.info("=============");
  }
  const user = settings.get("user");
  log.info("user => ", user);
  if (user?.code) {
    initializeTray();
    windowManager.toolbar?.open();
    if (app.dock) app.dock.hide();
  } else {
    windowManager.activation?.open();
  }
});

ipcMain.on("activate", () => {
  if (app.dock) app.dock.hide();
  windowManager.activation?.close();
  initializeTray();
  windowManager.toolbar?.open();
});
// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
ipcMain.on("quit-app", () => {
  globalShortcut.unregisterAll();
  app.quit();
});
