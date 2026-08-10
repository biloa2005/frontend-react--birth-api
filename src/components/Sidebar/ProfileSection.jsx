import React from "react";
import { User } from "lucide-react";

const ProfileSection = () => {
  return (
    <div className="profile-section">
      <div className="profile-avatar">
        <User size={28} />
      </div>

      <div className="profile-info">
        <h6>Jean Dupont</h6>
        <span>Agent</span>
      </div>
    </div>
  );
};

export default ProfileSection;