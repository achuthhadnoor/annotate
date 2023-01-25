import { createContext, useContext, useState } from "react";

 const AppContext = createContext(null);
 const AppStateUpdateContext = createContext(null);

export const useAppState = () => ({
  appState: useContext(AppContext),
  updateAppState: useContext(AppStateUpdateContext),
});

export const AppContextProvider = ({ children }) => {
  const [appState, setAppState] = useState({ selectedTool: "brush" });
  return (
    <AppContext.Provider value={appState}>
      <AppStateUpdateContext.Provider value={setAppState}>
        {children}
      </AppStateUpdateContext.Provider>
    </AppContext.Provider>
  );
};
