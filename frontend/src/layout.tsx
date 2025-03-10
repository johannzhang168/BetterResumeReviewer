import React from "react";
import Navbar from "./components/Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mt-5">{children}</main>
    </div>
  );
};

export default Layout;
