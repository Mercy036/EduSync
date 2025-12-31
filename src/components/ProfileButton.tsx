'use client'

import { UserCircle } from "lucide-react"
import "./SignOutButton.css"

interface ProfileButtonProps {
  collapsed?: boolean;
  onClick?: () => void; // Added this
}

export default function ProfileButton({ collapsed = false, onClick }: ProfileButtonProps) {
  return (
    <button
      onClick={onClick} // Use the prop
      className={`signout-btn ${collapsed ? "collapsed" : ""}`} 
      style={{ color: "#2b2b2b", marginBottom: "-5px", marginLeft: "-5px" }}
      title={collapsed ? "My Profile" : ""}
    >
      <UserCircle size={18} className="signout-icon" style={{ color: "#2b2b2b" }} />
      {!collapsed && <span className="signout-text">My Profile</span>}
    </button>
  )
}