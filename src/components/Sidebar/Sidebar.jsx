import React, { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  UserPlus,
  CheckCircle,
  Search,
  Printer,
  FileSpreadsheet,
  LogOut,
  Building2,
  MapPin,
  Sparkles,
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
    closeSidebar();
  };

  return (
    <>
      {/* Bouton burger mobile flottant */}
      <button
        className="fb-mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay sombre pour mobile */}
      {isOpen && (
        <div className="fb-sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar principale (Fixe desktop / Tiroir mobile) */}
      <aside className={`fb-sidebar ${isOpen ? "fb-sidebar-open" : ""}`}>
        
        {/* En-tête avec Logo SIVEC et Liseré Tricolore */}
        <div className="fb-sidebar-brand">
          <div className="cameroon-flag-bar">
            <span className="flag-green"></span>
            <span className="flag-red"></span>
            <span className="flag-yellow"></span>
          </div>

          <div className="fb-brand-content">
            <div className="fb-brand-icon">
              <span className="fb-brand-star">★</span>
            </div>
            <div className="fb-brand-info">
              <h2 className="fb-brand-title">SIVEC</h2>
              <p className="fb-brand-subtitle">République du Cameroun</p>
            </div>
          </div>
        </div>

        {/* Profil utilisateur Facebook */}
        <div className="fb-sidebar-profile-container">
          <ProfileSection />
        </div>

        {/* Navigation principale */}
        <div className="fb-sidebar-scroll">
          <div className="fb-sidebar-section">
            <span className="fb-section-title">MENU PRINCIPAL</span>

            <MenuItem
              to="/dashboard"
              icon={LayoutDashboard}
              label="Tableau de bord"
              iconColor="green"
              onClick={closeSidebar}
            />

            <MenuItem
              to="/births/create"
              icon={UserPlus}
              label="Enregistrer un acte"
              iconColor="green"
              onClick={closeSidebar}
            />

            <MenuItem
              to="/births/validate"
              icon={CheckCircle}
              label="Valider les actes"
              iconColor="yellow"
              badgeText="Attente"
              badgeColor="yellow"
              onClick={closeSidebar}
            />

            <MenuItem
              to="/tout"
              icon={FileSpreadsheet}
              label="Registre des naissances"
              iconColor="green"
              onClick={closeSidebar}
            />

            <MenuItem
              to="/births/search"
              icon={Search}
              label="Rechercher un acte"
              iconColor="yellow"
              onClick={closeSidebar}
            />

            <MenuItem
              to="/births/print"
              icon={Printer}
              label="Imprimer un acte"
              iconColor="red"
              onClick={closeSidebar}
            />
          </div>

          <div className="fb-sidebar-divider"></div>

          {/* Section Raccourcis Facebook */}
          <div className="fb-sidebar-section">
            <div className="fb-section-header">
              <span className="fb-section-title">CENTRES D'ÉTAT CIVIL</span>
              <Building2 size={14} className="text-muted" />
            </div>

            <div className="fb-shortcut-chip">
              <MapPin size={15} className="text-green" />
              <span>Mairie de Yaoundé I</span>
            </div>

            <div className="fb-shortcut-chip">
              <MapPin size={15} className="text-green" />
              <span>Mairie de Douala V</span>
            </div>

            <div className="fb-shortcut-chip">
              <MapPin size={15} className="text-yellow" />
              <span>Hôpital Central (Maternité)</span>
            </div>
          </div>

          {/* Carte Institutionnelle Cameroun */}
          <div className="fb-cameroon-card">
            <div className="fb-cameroon-card-header">
              <Sparkles size={16} className="text-yellow" />
              <span>Devise Nationale</span>
            </div>
            <p className="fb-cameroon-motto">
              « Paix — Travail — Patrie »
            </p>
            <div className="cameroon-flag-bar">
              <span className="flag-green"></span>
              <span className="flag-red"></span>
              <span className="flag-yellow"></span>
            </div>
          </div>
        </div>

        {/* Pied de page & Déconnexion */}
        <div className="fb-sidebar-footer">
          <button className="fb-logout-btn" onClick={handleLogout}>
            <div className="fb-logout-icon">
              <LogOut size={18} />
            </div>
            <span>Déconnexion</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;