import { app, Menu, nativeImage, shell, Tray } from "electron";
import { MenuItemConstructorOptions } from "electron/main";
import { join } from "path";
// import macosRelease from "./macos-release";
import { windowManager } from "./windows/windowManager";

let tray: Tray | null = null;
const email = "a@abc.com";
// const release = macosRelease();
const checkForUpdates = () => {
  // get latest version number and compare with app.getVersion() and send notification to user
};

const getContextMenu = () => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Toggle Annotate",
      click: () => {
        windowManager.main?.toggleView();
        windowManager.canvas?.toggleView();
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/openTemplate.png")
      ),
      accelerator: "meta+option+a",
    },
    {
      type: "separator",
    },
    {
      label: "Send Feedback", // send to google sheet
      click: () => {
        // windowManager.feedback?.open();
        shell.openExternal(
          `https://annotate.achuth.dev/feeback?version=${app.getVersion()}&email=${email}`
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
      label: "View Roadmap",
      click: () => {
        shell.openExternal("https://annotate.achuth.dev/link?rel=roadmap"); // notion page
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/subscribeTemplate.png")
      ),
    },
    {
      label: "Subscribe for Updates",
      click: () => {
        shell.openExternal("https://annotate.achuth.dev/link=newsletter "); // https://achuth.substack.com
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/subscribeTemplate.png")
      ),
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
      label: `Version ${app.getVersion()}`,
      enabled: false,
    },
    {
      label: "About",
      click: () => {
        shell.openExternal("https://annotate.achuth.dev");
      },
    },
    {
      label: "Check For Updates",
      click: () => {
        checkForUpdates();
      },
    },
    // {
    //   label: "Settings..",
    //   accelerator: "meta + ,",
    // },
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
};
