import { useEffect, useState } from "react";

export const useSyncStorage = () => {
  const [appState, setAppState] = useState({ selectedTool: "brush" });

  const onStorageUpdate = (e) => {
    const { key, newValue } = e;
    if (key === "appState") {
      setAppState(JSON.parse(newValue));
    }
  };

  const setSyncState = (newState)=>{
    window.localStorage.setItem("appState",JSON.stringify(newState))
    setAppState(newState);
  }

  useEffect(() => {
    setAppState(
      JSON.parse(localStorage.getItem("appState")) || { selectedTool: "brush" }
    );
    window.addEventListener("storage", onStorageUpdate);
    return () => {
      window.removeEventListener("storage", onStorageUpdate);
    };
  }, []);

  return{
    appState,
    setAppState:setSyncState
  }
};
