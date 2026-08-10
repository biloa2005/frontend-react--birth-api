import React, { useState } from "react";

import {
  Menu,
  X,
  Home,
  CheckCircle,
  Printer,
  UserPlus,
  Search,
  List,
  LogOut,
  Baby,
} from "lucide-react";

import ProfileSection from "./ProfileSection";
import MenuItem from "./MenuItem";

import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    console.log("Déconnexion");

    // Plus tard :
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");

    closeSidebar();
  };

  return (
    <>
      {/* Bouton burger mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le menu"
      >
        {isOpen ? <X size={25} /> : <Menu size={25} />}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

        {/* Logo */}
        <div className="sidebar-logo">

          <div className="logo-icon">
            <Baby size={27} />
          </div>

          <div>
            <h4>SIVEC</h4>
            <span>État Civil</span>
          </div>

        </div>

        {/* Profil */}
        <ProfileSection />

        {/* Menu */}
        <nav className="sidebar-nav">

          <div className="menu-title">
            MENU PRINCIPAL
          </div>

          <MenuItem
            to="/dashboard"
            icon={Home}
            label="Tableau de bord"
            onClick={closeSidebar}
          />

          <MenuItem
            to="/births/create"
            icon={UserPlus}
            label="Enregistrer une naissance"
            onClick={closeSidebar}
          />

          <MenuItem
            to="/births/validate"
            icon={CheckCircle}
            label="Valider une naissance"
            onClick={closeSidebar}
          />

          <MenuItem
            to="/births/search"
            icon={Search}
            label="Rechercher une naissance"
            onClick={closeSidebar}
          />

          <MenuItem
            to="/births/print"
            icon={Printer}
            label="Imprimer une naissance"
            onClick={closeSidebar}
          />

          <MenuItem
            to="/tout"
            icon={List}
            label="Toutes les naissances"
            onClick={closeSidebar}
          />

        </nav>

        {/* Déconnexion */}
        <div className="sidebar-footer">

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={20} />

            <span>
              Déconnexion
            </span>
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;