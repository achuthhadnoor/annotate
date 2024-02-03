import { app, globalShortcut, Menu, nativeImage, shell, Tray } from "electron";
import { MenuItemConstructorOptions } from "electron/main";
import { join } from "path";
// import macosRelease from "./macos-release";
import { windowManager } from "./windows/windowManager";
import { checkIsUpdateAvailable, downloadUpdate } from "./lib/update";
import { openLogFile } from "./lib/logger";

let tray: Tray | null = null;

const getContextMenu = () => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Toggle Annotate",
      click: () => {
        windowManager.toolbar?.toggleView();
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/openTemplate.png")
      ),
      accelerator: "meta+shift+7",
    },
    {
      type: "separator",
    },
    {
      label: "Send Feedback", // send to google sheet
      click: () => {
        // windowManager.feedback?.open();
        shell.openExternal(
          // `https://annotate.achuth.dev/feeback?version=${app.getVersion()}&email=${email}`
          `mailto:hey@achuth.dev`
        );
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/feedbackTemplate.png")
      ),
    },
    {
      label: "Guide", // keyboard shortcuts and settings
      click: () => {
        shell.openExternal(
          "https://achuth.notion.site/Guide-31322c68e03e45299b420ef50a32909d"
        );
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/manualTemplate.png")
      ),
    },
    {
      label: "Give a tip!", // Buy me a coffee
      click: () => {
        shell.openExternal("https://www.buymeacoffee.com/achuthhadnoor");
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/troubleTemplate.png")
      ),
    },
    {
      type: "separator",
    },
    {
      label: "Follow us",
      click: () => {
        shell.openExternal("https://twitter.com/achuth_hadnoor");
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/followTemplate.png")
      ),
    },
    {
      type: "separator",
    },
    {
      label: "About",
      click: () => {
        shell.openExternal("https://annotate.achuth.dev");
      },
    },
    {
      label: checkIsUpdateAvailable()
        ? "Check For Updates"
        : `Version ${app.getVersion()}`,
      enabled: checkIsUpdateAvailable(),
      click: () => {
        downloadUpdate();
      },
    },
    {
      label: "open log",
      click: () => {
        openLogFile();
      },
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      role: "quit",
      accelerator: "meta+q",
    },
  ];
  return Menu.buildFromTemplate(template);
};

export const initializeTray = () => {
  tray = new Tray(join(__dirname, "../assets/annotateTemplate.png"));
  // tray.setTitle("◉"); // ◎
  tray.setToolTip("Annotate");
  tray.setContextMenu(getContextMenu());
  globalShortcut.register("meta+shift+7", () => {
    windowManager.toolbar?.toggleView();
  });
};
