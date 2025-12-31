'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/src/components/ui/table"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Trash, Download, FileText, UploadCloud } from "lucide-react"
import { useState, useEffect } from "react"
import UploadButton from "@/src/components/UploadButtonCloudinary"
import "./MyShelf.css"
import { auth } from "@/src/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import AuthGuard from "@/src/components/AuthGuard"
import VideoCardList from "@/src/components/VideoCardList"
import AddVideoUrl from "@/src/components/AddVideoUrl"
import UploadNotesButton from "@/src/components/UploadNotesButtonCloudinary"

import { toast } from 'react-toastify';
import CustomToast from "@/src/components/customToast"; 

export default function MyShelf() {
  const [pdfs, setPdfs] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchFiles = async (user: any) => {
      setLoading(true)
      try {
        const idToken = await user.getIdToken()
        const res = await fetch("/api/files?type=pdf", {
          headers: { Authorization: `Bearer ${idToken}` },
        })
        const data = await res.json()
        setPdfs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    const fetchNotes = async (user: any) => {
      setLoading(true)
      try {
        const idToken = await user.getIdToken()
        const res = await fetch("/api/files?type=notes", {
          headers: { Authorization: `Bearer ${idToken}` },
        })
        const data = await res.json()
        setNotes(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFiles(user)
        fetchNotes(user)
      }
      else {
        setPdfs([])
        setNotes([])
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [refreshKey])

  const handlePdfUploadSuccess = () => {
    setRefreshKey(p => p + 1);
    toast.success("PDF Resource uploaded successfully");
  }

  const handleVideoAddSuccess = () => {
    setRefreshKey(p => p + 1);
    toast.success("YouTube video added to gallery");
  }

  const handleNoteUploadSuccess = () => {
    setRefreshKey(p => p + 1);
    toast.success("Personal Note saved");
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return
    const user = auth.currentUser
    if (!user) return

    const idToken = await user.getIdToken()
    const res = await fetch("/api/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ id, type: "pdf" }),
    })

    if (res.ok) {
      setRefreshKey((p) => p + 1)
      toast.info("File deleted");
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Delete this note?")) return
    const user = auth.currentUser
    if (!user) return

    const idToken = await user.getIdToken()
    const res = await fetch("/api/files", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ id, type: "notes" }),
    })

    if (res.ok) {
      setRefreshKey((p) => p + 1)
      toast.info("Note deleted");
    }
  }

  return (
    <AuthGuard>
      <section className="shelf-dashboard">
        <CustomToast />
        
        <div className="shelf-dashboard-header">
          <h1>My <span>Shelf</span></h1>
          <p>Organize your learning materials in one place.</p>
        </div>

        <Tabs defaultValue="resources" className="myshelf">
          <TabsList className="shelf-tabs">
            <TabsTrigger value="resources">PDF Resources</TabsTrigger>
            <TabsTrigger value="videos">YouTube Gallery</TabsTrigger>
            <TabsTrigger value="notes">Personal Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            <div className="shelf-header">
              <h2>Study Materials</h2>
              <div className="shelf-upload-wrapper">
                <UploadButton type="pdf" onUploaded={handlePdfUploadSuccess} />
              </div>
            </div>

            <div className="shelf-folder">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : pdfs.length === 0 ? (
                <div className="shelf-empty-box">No PDFs uploaded yet.</div>
              ) : (
                <Table>
                  <TableBody>
                    {pdfs.map((file) => (
                      <TableRow key={file.id} className="border-b last:border-0">
                        <TableCell>
                          <div className="shelf-file">
                            <span className="shelf-icon"><FileText size={20} /></span>
                            <span>{file.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="shelf-action">
                            <a 
                              href={`${file.url}?dl=1`} 
                              download={`${file.name}.pdf`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="shelf-btn download"
                            >
                              <Download size={16} /> Download
                            </a>
                            <button className="shelf-btn delete" onClick={() => handleDelete(file.id)}>
                              <Trash size={16} /> Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Refresh after every Upload</TableCaption>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="shelf-header">
              <h2>Video Library</h2>
              <div className="shelf-upload-wrapper">
                 <AddVideoUrl onAdded={handleVideoAddSuccess} />
              </div>
            </div>
            <VideoCardList refreshKey={refreshKey} />
          </TabsContent>

          <TabsContent value="notes">
            <div className="shelf-header">
              <h2>Personal Notes</h2>
              <div className="shelf-upload-wrapper">
                <UploadNotesButton type="notes" onUploaded={handleNoteUploadSuccess} />
              </div>
            </div>

            <div className="shelf-folder">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : notes.length === 0 ? (
                <div className="shelf-empty-box">No Notes uploaded yet. Let's Start Noting!</div>
              ) : (
                <Table>
                  <TableBody>
                    {notes.map((file) => (
                      <TableRow key={file.id} className="border-b last:border-0">
                         <TableCell>
                          <div className="shelf-file">
                            <span className="shelf-icon"><FileText size={20} /></span>
                            <span>{file.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="shelf-action">
                            <a 
                              href={`${file.url}?dl=1`} 
                              download={`${file.name}.pdf`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="shelf-btn download"
                            >
                              <Download size={16} /> Download
                            </a>
                            <button className="shelf-btn delete" onClick={() => handleDeleteNote(file.id)}>
                              <Trash size={16} /> Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Refresh after every Upload</TableCaption>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </AuthGuard>
  )
}