import { app, ipcMain, IpcMainEvent } from "electron";
import prepareNext from "electron-next";
import Store from "electron-store";
import AutoLaunch from "auto-launch";
import { initializeTray } from "./tray";
import { windowManager } from "./windows/windowManager";
import "./windows/load";
import { getData, updateData } from "./store";
import { hostname } from "os";

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

export const store = new Store();
export const autoLauncher = new AutoLaunch({
  name: "Annotate",
  path: "/Applications/Annotate.app",
});

app.on("second-instance", () => {
  app.quit();
});

app.commandLine.appendSwitch("disable-features", "CrossOriginOpenerPolicy");

app.whenReady().then(async () => {
  await prepareNext("./renderer");
  if (getData()) {
    if (app.dock) app.dock.hide();
    initializeTray();
    windowManager.main?.open();
    windowManager.canvas?.open();
  } else {
    windowManager.onboard?.open();
  }
});

ipcMain.on("activate", () => {
  if (app.dock) app.dock.hide();
  windowManager.onboard?.close();
  initializeTray();
  windowManager.main?.open();
  windowManager.canvas?.open();
  // store.set("user-info", JSON.stringify(true));
  updateData({ name: hostname() });
});
// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  setTimeout(() => event.sender.send("message", message), 500);
});

ipcMain.on("quit-app", () => {
  app.quit();
});
