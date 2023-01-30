import { Menu, nativeImage, Tray } from "electron";
import { MenuItemConstructorOptions } from "electron/main";
import { join } from "path";
import { windowManager } from "./windows/windowManager";

let tray: Tray | null = null;
// let active = false;

// const trayImage = (path:string)=>{
//     return nativeImage.createFromPath(join(__dirname,path)).resize({height:16,width:16})
// }

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
    },
    {
      type: "separator",
    },
    {
      label: "Send Feedback",
      click: () => {
        windowManager.feedback?.open();
      },
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/feedbackTemplate.png")
      ),
    },
    {
      label: "Manual",
      click: () => {},
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/manualTemplate.png")
      ),
    },
    {
      label: "Troubleshooting",
      click: () => {},
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/troubleTemplate.png")
      ),
    },
    {
      type: "separator",
    },
    {
      label: "Subscribe for Updates",
      click: () => {},
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/subscribeTemplate.png")
      ),
    },
    {
      label: "Follow us",
      click: () => {},
      icon: nativeImage.createFromPath(
        join(__dirname, "../assets/followTemplate.png")
      ),
    },
    {
      type: "separator",
    },
    {
      label: "Version 0.0.1",
      enabled: false,
    },
    {
      role: "about",
      click: () => {},
    },
    {
      label: "Check For Updates",
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
    },
  ];
  return Menu.buildFromTemplate(template);
};

export const initializeTray = () => {
  tray = new Tray(join(__dirname, "../assets/annotateTemplate.png"));
  // tray.setTitle("◉"); // ◎
  tray.setToolTip("lapse");
  tray.setContextMenu(getContextMenu());
};
