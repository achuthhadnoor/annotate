import { Menu, Tray } from "electron";
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
    },
    {
      label: "Toggle pass Through",
      click: () => {
        windowManager.canvas?.clickThrough();
      },
    },
    {
      type: "separator",
    },
    {
      role: "about",
    },
    {
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
