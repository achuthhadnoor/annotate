import {
  BrowserWindow,
  systemPreferences,
  screen,
  Display,
  app,
  ipcMain,
} from "electron";

import { is } from "electron-util";

import { settings } from "../../lib/settings";
import { join } from "path";
import { windowManager } from "../windowManager";
import { format } from "url";

const canvases = new Map<number, BrowserWindow>();
let notificationId: number | undefined;
let isOpen = false;
let canvasPassThrough = false;

const closeAllCanvases = () => {
  screen.removeAllListeners("display-removed");
  screen.removeAllListeners("display-added");

  for (const [id, canvas] of canvases) {
    canvas.destroy();
    canvases.delete(id);
  }

  isOpen = false;

  if (notificationId !== undefined) {
    systemPreferences.unsubscribeWorkspaceNotification(notificationId);
    notificationId = undefined;
  }
};
const openCanvas = (display: Display, activeDisplayId?: number) => {
  const { id, bounds } = display;
  const { x, y, width, height } = bounds;
  const canvas = new BrowserWindow({
    x,
    y,
    title: "",
    width,
    height,
    hasShadow: false,
    enableLargerThanScreen: true,
    resizable: false,
    movable: false,
    frame: false,
    transparent: true,
    show: false,
    // alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      preload: join(__dirname, "./preload.js"),
    },
  });
  isOpen = true;
  const url = is.development
    ? "http://localhost:8000/canvas"
    : format({
        pathname: join(__dirname, "../../../renderer/out/canvas.html"),
        protocol: "file:",
        slashes: true,
      });
  canvas.loadURL(url);
  // canvas.webContents.openDevTools();
  // canvas.setAlwaysOnTop(true, "floating");
  // is.macos && canvas.setHiddenInMissionControl(true);
  canvas.webContents.on("did-finish-load", () => {
    const isActive = activeDisplayId === id;
    const displayInfo = {
      isActive,
      id,
      x,
      y,
      width,
      height,
    };

    if (isActive) {
      const savedCanvas = settings.get("canvas", {});
      // @ts-expect-error
      if (savedCanvas.displayId === id) {
        // @ts-expect-error
        displayInfo.canvas = savedCanvas;
      }
    }

    canvas.webContents.send("display", displayInfo);
    canvas.show();
  });

  canvas.on("closed", closeAllCanvases);
  canvases.set(id, canvas);
  return canvas;
};

const openCanvasWindow = async () => {
  closeAllCanvases();
  isOpen = true;
  const displays = screen.getAllDisplays();
  const activeDisplayId = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint()
  ).id;

  for (const display of displays) {
    openCanvas(display, activeDisplayId);
  }

  for (const canvas of canvases.values()) {
    canvas.showInactive();
  }

  canvases.get(activeDisplayId)?.focus();

  // Electron typing issue, this should be marked as returning a number
  notificationId = (systemPreferences as any).subscribeWorkspaceNotification(
    "NSWorkspaceActiveSpaceDidChangeNotification",
    () => {
      closeAllCanvases();
    }
  );

  screen.on("display-removed", (_, oldDisplay) => {
    const { id } = oldDisplay;
    const canvas = canvases.get(id);

    if (!canvas) {
      return;
    }

    const wasFocused = canvas.isFocused();

    canvas.removeAllListeners("closed");
    canvas.destroy();
    canvases.delete(id);

    if (wasFocused) {
      const activeDisplayId = screen.getDisplayNearestPoint(
        screen.getCursorScreenPoint()
      ).id;
      if (canvases.has(activeDisplayId)) {
        canvases.get(activeDisplayId)?.focus();
      }
    }
  });

  screen.on("display-added", (_, newDisplay) => {
    const canvas = openCanvas(newDisplay);
    canvas.showInactive();
  });
};

const toggleCanvases = () => {
  canvasPassThrough = canvasPassThrough ? false : true;

  if (notificationId !== undefined) {
    systemPreferences.unsubscribeWorkspaceNotification(notificationId);
    notificationId = undefined;
  }

  for (const canvas of canvases.values()) {
    canvas.removeAllListeners("blur");
    canvas.setIgnoreMouseEvents(canvasPassThrough, {
      forward: canvasPassThrough,
    });
    canvas.setVisibleOnAllWorkspaces(true);
  }
};
ipcMain.on("toggle-passthrough", () => {
  toggleCanvases();
});

const isCanvasOpen = () => isOpen;

app.on("before-quit", closeAllCanvases);

app.on("browser-window-created", () => {
  if (!isCanvasOpen()) {
    app.dock.show();
  }
});

const toggleViews = () => {
  for (const canvasView of canvases.values()) {
    canvasView?.isVisible() ? canvasView?.hide() : canvasView?.show();
  }
};

windowManager.setCanvas({
  open: openCanvasWindow,
  close: closeAllCanvases,
  isOpen: isCanvasOpen,
  toggleView: toggleCanvases,
  toggleVisibility: toggleViews,
});
