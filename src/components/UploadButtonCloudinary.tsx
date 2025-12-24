'use client'

import { auth } from "@/src/lib/firebase"

type Props = {
  type: "pdf" | "video"
  onUploaded?: () => void
}

export default function UploadButton({ type, onUploaded }: Props) {
  const upload = async (file: File) => {
    const user = auth.currentUser

    if (!user) {
      alert("Please login first")
      return
    }

    const idToken = await user.getIdToken()

    const form = new FormData()
    form.append("file", file)
    form.append("type", type)

    await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: form,
    })

    onUploaded?.()
  }

  return (
    <label className="btn cursor-pointer">
      Upload {type}
      <input
        type="file"
        hidden
        accept={type === "pdf" ? ".pdf" : "video/*"}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) upload(file)
        }}
      />
    </label>
  )
}
