import React, { ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => {
  const themeBody = useRef(null);

  return <div id="body">{children}</div>;
};

export default Layout;
