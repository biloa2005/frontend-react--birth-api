import React from "react";
import { NavLink } from "react-router-dom";

const MenuItem = ({
  to,
  icon: Icon,
  label,
  badgeText = null,
  badgeColor = "green", // "green" | "yellow" | "red"
  iconColor = "green", // "green" | "yellow" | "red"
  onClick,
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `fb-menu-item ${isActive ? "active" : ""}`
      }
    >
      <div className={`fb-menu-icon-box icon-${iconColor}`}>
        <Icon size={20} />
      </div>

      <span className="fb-menu-label">{label}</span>

      {badgeText && (
        <span className={`fb-menu-badge badge-${badgeColor}`}>
          {badgeText}
        </span>
      )}
    </NavLink>
  );
};

export default MenuItem;