import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSyncStorage } from "../hooks/syncStorageHook";

const AppContext = createContext(null);
const AppStateUpdateContext = createContext(null);

export const useAppState = () => useContext(AppContext);
export const useUpdateAppState = () => useContext(AppStateUpdateContext);

export const AppContextProvider = ({ children }) => {
  const { appState, setAppState } = useSyncStorage();
  return (
    <AppContext.Provider value={appState}>
      <AppStateUpdateContext.Provider
        value={(newState) => {
          setAppState(newState);
        }}
      >
        {children}
      </AppStateUpdateContext.Provider>
    </AppContext.Provider>
  );
};
