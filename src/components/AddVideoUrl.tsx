'use client'

import { useState } from "react"
import { auth } from "@/src/lib/firebase"
import { Plus, Youtube } from "lucide-react"

export default function AddVideoUrl({ onAdded }: { onAdded?: () => void }) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!url.trim()) return
    const user = auth.currentUser
    if (!user) return

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      })
      if (res.ok) {
        setUrl("")
        onAdded?.()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-xl items-center gap-3">
      <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-slate-200 bg-white pl-3 transition-colors focus-within:border-black">
        <Youtube size={18} className="shrink-0 text-red-600" />
        <input
          type="text"
          placeholder="Paste YouTube URL..."
          className="w-full border-none bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button 
        className="flex h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-black px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" 
        onClick={submit} 
        disabled={loading || !url}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></span>
        ) : (
          <>
            <Plus size={18} /> Add Video
          </>
        )}
      </button>
    </div>
  )
}