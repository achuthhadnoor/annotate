// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IpcRenderer } from "electron";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer;
    }
  }
}

export type ICanvasTools =
  | "selection"
  | "text"
  | "brush"
  | "line"
  | "rectangle"
  | "circle"
  | "eraser"
  | "arrow"
  | "cursor-focus"
  | "cursor-highlight";

export interface IElement {
  id: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  type?: string;
  text?: string;
  points?: any[];
  options?: any;
  roughElement?: any;
}
