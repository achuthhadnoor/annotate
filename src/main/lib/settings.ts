import Store from "electron-store";
import { hostname } from "os";

export const shortcuts = {
  triggerCropper: "Toggle Kap",
};

const shortcutSchema = {
  type: "string",
  default: "",
};

interface Settings {
  user: {
    hostname: string;
    code: string;
  };
  allowAnalytics: boolean;
  highlightClicks: boolean;
  cropperShortcut: {
    metaKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    character: string;
  };
  enableShortcuts: boolean;
  shortcuts: {
    [key in keyof typeof shortcuts]: string;
  };
  version: string;
}
export const settings = new Store<Settings>({
  schema: {
    user: {
      type: "object",
      properties: {
        hostname: {
          type: "string",
          default: hostname(),
        },
        email: {
          type: "string",
          default: "",
        },
        code: {
          type: "string",
          default: "",
        },
      },
    },
    allowAnalytics: {
      type: "boolean",
      default: true,
    },
    highlightClicks: {
      type: "boolean",
      default: false,
    },
    cropperShortcut: {
      type: "object",
      properties: {
        metaKey: {
          type: "boolean",
          default: true,
        },
        altKey: {
          type: "boolean",
          default: false,
        },
        ctrlKey: {
          type: "boolean",
          default: false,
        },
        shiftKey: {
          type: "boolean",
          default: true,
        },
        character: {
          type: "string",
          default: "7",
        },
      },
    },
    enableShortcuts: {
      type: "boolean",
      default: true,
    },
    shortcuts: {
      type: "object",
      // eslint-disable-next-line unicorn/no-array-reduce
      properties: Object.keys(shortcuts).reduce(
        (acc, key) => ({ ...acc, [key]: shortcutSchema }),
        {}
      ),
      default: {},
    },
    version: {
      type: "string",
      default: "",
    },
  },
});
