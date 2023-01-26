import { app, ipcMain, IpcMainEvent } from "electron";
import prepareNext from "electron-next";
import { initializeTray } from "./tray";
import { windowManager } from "./windows/windowManager";
import "./windows/load";

(async () => {
  await app.whenReady();
  await prepareNext("./renderer");
  initializeTray();
  windowManager.main?.open();
  windowManager.canvas?.open();
})();

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", message), 500);
});
