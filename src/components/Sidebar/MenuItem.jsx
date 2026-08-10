import React from "react";
import { NavLink } from "react-router-dom";

const MenuItem = ({ to, icon: Icon, label, danger = false, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `sidebar-menu-item ${isActive ? "active" : ""} ${
          danger ? "danger" : ""
        }`
      }
    >
      <Icon size={20} strokeWidth={2} />

      <span>{label}</span>
    </NavLink>
  );
};

export default MenuItem;