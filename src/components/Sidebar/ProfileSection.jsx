import React from "react";
import { UserCheck, Shield } from "lucide-react";

const ProfileSection = () => {
  return (
    <div className="fb-profile-shortcut">
      <div className="fb-avatar-container">
        <div className="fb-avatar">
          <Shield size={20} className="fb-avatar-icon" />
        </div>
        <span className="fb-online-indicator" title="En ligne"></span>
      </div>

      <div className="fb-profile-details">
        <div className="fb-profile-name">
          <span>Jean Dupont</span>
          <span className="fb-verified-star" title="Officier vérifié">★</span>
        </div>
        <span className="fb-profile-role">Officier d'État Civil</span>
      </div>
    </div>
  );
};

export default ProfileSection;