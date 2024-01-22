export interface toolbarManager {
  open: () => void;
  isOpen: () => boolean;
  toggleView: () => void;
  close: () => void;
}

export interface canvasWindowManager {
  open: () => void;
  isOpen: () => boolean;
  toggleView: () => void;
  toggleVisibility: () => void;
  close: () => void;
}

export interface activationWindowManager {
  open: () => boolean;
  close: () => void;
  isOpen: () => boolean;
  validate: (
    email: string,
    key: string
  ) => { isValid: boolean; message: string };
  checkUserExist?: (userData: any) => boolean;
}
export interface feedbackWindowManager {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

export class WindowManager {
  toolbar?: toolbarManager;
  canvas?: canvasWindowManager;
  activation?: activationWindowManager;
  feedback?: feedbackWindowManager;

  closeAll = () => {
    this.toolbar?.close();
    this.canvas?.close();
  };

  setToolbar = (toolbarManager: toolbarManager) => {
    this.toolbar = toolbarManager;
  };
  setCanvas = (canvasManager: canvasWindowManager) => {
    this.canvas = canvasManager;
  };
  setActivation = (activationManager: activationWindowManager) => {
    this.activation = activationManager;
  };
  setFeedbackWindow = (feedbackManager: feedbackWindowManager) => {
    this.feedback = feedbackManager;
  };
}

export const windowManager = new WindowManager();
