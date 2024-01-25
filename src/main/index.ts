import { app, ipcMain } from "electron";
import log from "./lib/logger";
import { windowManager } from "./windows/windowManager";
import "./windows/load";
import { settings } from "./lib/settings";
import { initializeTray } from "./tray";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

app.commandLine.appendSwitch("disable-features", "CrossOriginOpenerPolicy");

app.whenReady().then(async () => {
  const user = settings.get("user");
  log.info("user => ", user);
  if (user?.code) {
    if (app.dock) app.dock.hide();
    initializeTray();
    windowManager.toolbar?.open();
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
  app.quit();
});
