import { Menu, Tray } from "electron";
import { MenuItemConstructorOptions } from "electron/main";
import { join } from "path";
import { togglePassThrough, toggleWindow } from ".";

let tray: Tray | null = null;
// let active = false;

// const trayImage = (path:string)=>{
//     return nativeImage.createFromPath(join(__dirname,path)).resize({height:16,width:16})
// }

const getContextMenu = () => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Toggle Annotate",
      click:()=>{
        toggleWindow()
      }
    },
    {
      label:"Activate",
      click:()=>{
        togglePassThrough()
      }
    },
    {
        type:"separator"
    },
    {
        role:"about"
    },
    {
        role:"quit"
    }
  ];
   return Menu.buildFromTemplate(template);
};

export const initializeTray = () => {
  tray = new Tray(join(__dirname,'../build/annotateTemplate.png')
    );
//   tray.setTitle("◉"); // ◎
  tray.setToolTip("lapse");
  tray.setContextMenu(getContextMenu());
};
