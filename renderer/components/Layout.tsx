import React, { ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => {
  const themeBody = useRef(null);

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
    return () => {window.removeEventListener("keydown",()=>{})};
  }, []);

  return (
    <div id="body">
      {children}
    </div>
  );
};

export default Layout;
