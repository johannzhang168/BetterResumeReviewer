import React from "react";
import Navbar from "./components/homepage/Navbar/Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
