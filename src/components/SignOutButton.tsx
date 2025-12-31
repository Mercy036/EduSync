'use client'

import { LogOut } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/src/lib/firebase"
import { useRouter } from "next/navigation"
import "./SignOutButton.css"

interface SignOutButtonProps {
  collapsed?: boolean
}

export default function SignOutButton({ collapsed = false }: SignOutButtonProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut(auth)
    router.replace("/")
  }

  return (
    <button
      onClick={handleSignOut}
      className={`signout-btn ${collapsed ? "collapsed" : ""}`}
      aria-label="Sign out"
      // Optional: Add a tooltip so users still know what the button does when icon-only
      title={collapsed ? "Sign out" : ""} 
    >
      <LogOut size={18} className="signout-icon" />
      
      {/* CONDITIONAL RENDERING: 
          This ensures the text element is completely removed 
          from the HTML when collapsed. */}
      {!collapsed && <span className="signout-text">Sign out</span>}
    </button>
  )
}