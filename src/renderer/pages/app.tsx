import { useEffect } from "react";
import Main from './main'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Onboard from "./onboard";
import { AppContextProvider } from "../context/appContext";
import Canvas from "./canvas";

export default function MyApp() {
  useEffect(() => {
    const keyboardShortcut = (e: any) => {
      if (
        (e.key === "r" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "R" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        console.log("ctrl + r");
      }
    }
    if (window) {
      window.addEventListener("keydown",keyboardShortcut );
    }
    return () => {
      window.removeEventListener("keydown",keyboardShortcut);
    };
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
    },
    {
      path:'/onboard',
      element:<Onboard/>
    },
    {
      path:'/canvas',
      element:<Canvas/>
    },
  ]);
  
  return (
    <AppContextProvider>
       <RouterProvider router={router} />
    </AppContextProvider>
  );
}
