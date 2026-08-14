import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  return (
    <div className="fb-layout">
      {/* Sidebar gauche positionnée comme à l'origine */}
      <Sidebar />

      {/* Contenu principal fluide et 100% responsive */}
      <main className="fb-main-content">
        <div className="fb-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;