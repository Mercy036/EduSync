"use client"

import "./TopBar.css"
import { Brain } from "lucide-react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/src/lib/firebase"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TopBar() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      const res = await fetch("/api/auth/firebase/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      const data = await res.json()

      if (data.redirectTo) {
        router.push(data.redirectTo)
      }
    } catch (err) {
      console.error("Google login failed", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="sd-wrapper">
      <div className="sd-left">
        <div className="sd-logo">
          <Brain size={28} strokeWidth={2} className="logo-icon" color="white" />
        </div>
        <div>
          <h2 className="sd-sitename">EduSync</h2>
          <span className="sd-sitemotto">AI-Powered Scheduling</span>
        </div>
      </div>

      <div className="sd-right">
        <button
          className="sd-btn sign-in"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login with Google"}
        </button>
      </div>
    </header>
  )
}
