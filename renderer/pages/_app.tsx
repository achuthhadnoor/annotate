import { useEffect } from "react";
import { AppContextProvider } from "../context/appContext";
import "../style.css";
export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (window) {
      window.addEventListener("keydown", (e) => {
        e.preventDefault();
        if (e.key === "r" || (e.key === "R" && e.ctrlKey)) {
          e.preventDefault();
          console.log("ctrl + r");
        }
      });
    }
    return () => {
      window.removeEventListener("keydown", () => {});
    };
  }, []);

  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}
