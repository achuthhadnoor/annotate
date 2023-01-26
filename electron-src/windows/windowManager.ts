export interface mainWindowManager {
  open: () => void;
  isOpen: () => boolean;
  toggleView: () => void;
  close: () => void;
}

export interface canvasWindowManager {
  open: () => void;
  isOpen: () => boolean;
  toggleView: () => void;
  clickThrough: () => void;
  closeAll: () => void;
  close: () => void;
}

export interface onboardWindowManager {
  open: () => void;
  close: () => void;
  validate: (
    email: string,
    key: string
  ) => { isValid: boolean; message: string };
  checkUserExist?: (userData: any) => boolean;
}

export class WindowManager {
  main?: mainWindowManager;
  canvas?: canvasWindowManager;
  onboard?: onboardWindowManager;

  closeAll = () => {
    this.main?.close();
    this.canvas?.close();
  };

  setMainWindow = (mainManager: mainWindowManager) => {
    this.main = mainManager;
  };
  setCanvasWindow = (canvasManager: canvasWindowManager) => {
    this.canvas = canvasManager;
  };
  setOnboardWindow = (onboardManager: onboardWindowManager) => {
    this.onboard = onboardManager;
  };
}

export const windowManager = new WindowManager();
