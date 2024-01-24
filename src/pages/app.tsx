import { useEffect } from "react";
import { AppContextProvider } from "../context/appContext";
import "../style.css";
export default function MyApp({ children }) {
  useEffect(() => {
    if (window) {
      window.addEventListener("keydown", (e: any) => {
        if (
          (e.key === "r" && (e.ctrlKey || e.metaKey)) ||
          (e.key === "R" && (e.ctrlKey || e.metaKey))
        ) {
          e.preventDefault();
          console.log("ctrl + r");
        }
      });
    }
    return () => {
      window.removeEventListener("keydown", () => { });
    };
  }, []);

  return (
    <AppContextProvider>
      {children}
    </AppContextProvider>
  );
}
