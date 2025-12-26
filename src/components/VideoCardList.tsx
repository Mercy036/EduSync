'use client'

import { useEffect, useState } from "react"
import { auth } from "@/src/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Trash, PlayCircle } from "lucide-react"
import "./VideoCard.css"
import { toast } from "react-toastify"

export default function VideoCardList({ refreshKey }: { refreshKey?: number }) {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVideos = async (user: any) => {
    setLoading(true)
    const token = await user.getIdToken()
    const res = await fetch("/api/videos", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setVideos(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) fetchVideos(user)
      else { setVideos([]); setLoading(false); }
    })
    return () => unsub()
  }, [refreshKey])

  const handleDelete = async (url: string) => {
    const user = auth.currentUser
    if (!user || !confirm("Delete this video?")) return
    const token = await user.getIdToken()
    const res = await fetch("/api/videos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url }),
    })
    if (res.ok) {
      fetchVideos(user)
      toast.info("Video deleted")
    }
  }

  if (loading) {
    return (
      <div className="yt-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="yt-card">
            <Skeleton className="h-[160px] w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4 mt-3" />
            <Skeleton className="h-3 w-1/2 mt-2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="yt-grid">
      {videos.map(video => (
          <div key={video.id} className="yt-card">
          <div className="thumbnail-container">
            <img src={video.thumbnail} alt={video.title} loading="lazy" />
            <a href={video.url} target="_blank" rel="noreferrer" className="play-overlay">
              <PlayCircle size={40} color="white" />
            </a>
            <button className="yt-delete-btn" onClick={() => handleDelete(video.url)}>
              <Trash size={14} />
            </button>
          </div>

          <div className="yt-meta">
            <h4>{video.title}</h4>
            <p>{video.channel}</p>
          </div>
        </div>
      ))}
    </div>
  )
}