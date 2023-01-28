import { useEffect, useState } from "react";

export interface IAppState {
  selectedTool: string;
  stroke: number;
  undoEnabled: boolean;
  redoEnabled: boolean;
  activeColor: string;
  primaryColor: string;
  secondaryColor: string;
  ternaryColor: string;
}

export const defaultState = {
  selectedTool: "brush",
  stroke: 3,
  fill: true,
  undoEnabled: true,
  redoEnabled: false,
  activeColor: "#62ffa1",
  primaryColor: "#d479ff",
  secondaryColor: "#ffae64",
  ternaryColor: "#62ffa1",
};

export const useSyncStorage = () => {
  const [appState, setAppState] = useState<IAppState>(defaultState);

  const onStorageUpdate = (e) => {
    const { key, newValue } = e;
    if (key === "appState") {
      setAppState(JSON.parse(newValue));
    }
  };

  const setSyncState = (newState) => {
    window.localStorage.setItem("appState", JSON.stringify(newState));
    setAppState(newState);
  };

  useEffect(() => {
    localStorage.clear();
    setAppState(JSON.parse(localStorage.getItem("appState")) || defaultState);
    window.addEventListener("storage", onStorageUpdate);
    return () => {
      window.removeEventListener("storage", onStorageUpdate);
    };
  }, []);

  return {
    appState,
    setAppState: setSyncState,
  };
};
