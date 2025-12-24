'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/components/ui/table"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Folder, Trash, Download } from "lucide-react"

import { useState, useEffect } from "react"
import UploadButton from "@/src/components/UploadButtonCloudinary"
import "./MyShelf.css"
import { auth } from "@/src/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"



function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Table>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="file">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </TableCell>
            <TableCell className="action">
              <Skeleton className="h-8 w-[90px] rounded-md ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function MyShelf() {
  const [pdfs, setPdfs] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)


  useEffect(() => {
    let unsubscribe: () => void

    const fetchFiles = async (user: any) => {
      setLoading(true)

      const idToken = await user.getIdToken()

      const [pdfRes, videoRes] = await Promise.all([
        fetch("/api/files?type=pdf", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }),
        fetch("/api/files?type=video", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }),
      ])

      const [pdfData, videoData] = await Promise.all([
        pdfRes.json(),
        videoRes.json(),
      ])

      setPdfs(pdfData)
      setVideos(videoData)
      setLoading(false)
    }

    unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFiles(user)
      } else {
        setPdfs([])
        setVideos([])
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [refreshKey])

  const handleDelete = async (id: string, type: "pdf" | "video") => {
    if (!confirm("Delete this file?")) return

    const user = auth.currentUser
    if (!user) {
      alert("Please login first")
      return
    }

    const idToken = await user.getIdToken()

    const res = await fetch("/api/files", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ id, type }),
    })

    if (res.ok) {
      setRefreshKey((p) => p + 1)
    } else {
      alert("Failed to delete file")
    }
  }


  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h1>
          My <span>Shelf</span>
        </h1>
        <p>Your resources simplified</p>
      </div>

      <Tabs defaultValue="resources" className="myshelf">
        <TabsList className="tabs">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="notes">My Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="resources">
          <div className="header">
            <h2>PDF Notes</h2>
            <UploadButton
              type="pdf"
              onUploaded={() => setRefreshKey(prev => prev + 1)}
            />
          </div>

          <div className="folder">
            {loading ? (
              <TableSkeleton />
            ) : pdfs.length === 0 ? (
              <p className="empty">No PDFs uploaded yet</p>
            ) : (
              <Table>
                <TableBody>
                  {pdfs.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="file">
                        <span className="icon">
                          <Folder size={20} />
                        </span>
                        {file.name}
                      </TableCell>
                      <TableCell className="action">
                        <a
                          href={`${file.url}?dl=1`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn download"
                        >
                          <Download size={14} />
                          Download
                        </a>
                        <button
                          className="btn delete"
                          onClick={() => handleDelete(file.id, "pdf")}
                        >
                          <Trash size={14} />
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
        <TabsContent value="videos">
          <div className="header">
            <h2>Videos</h2>
            <UploadButton
              type="video"
              onUploaded={() => setRefreshKey(prev => prev + 1)}
            />
          </div>

          <div className="folder">
            {loading ? (
              <TableSkeleton />
            ) : videos.length === 0 ? (
              <p className="empty">No videos uploaded yet</p>
            ) : (
              <Table>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="file">
                        <span className="icon">🎥</span>
                        {video.name}
                      </TableCell>
                      <TableCell className="action">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                        >
                          Open
                        </a>
                        <button
                          className="btn delete"
                          onClick={() => handleDelete(video.id, "video")}
                        >
                          <Trash size={14} />
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
        <TabsContent value="notes">
          <div className="folder empty-box">
            Your personal notes will appear here.
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
