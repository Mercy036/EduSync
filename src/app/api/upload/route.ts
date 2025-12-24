import { NextResponse } from "next/server"
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: Request) {
  try {
    /* 1️⃣ Verify Firebase user */
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken)
    const uid = decoded.uid

    /* 2️⃣ Read form data */
    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as "pdf" | "video"

    if (!file || !type) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    /* 3️⃣ Build per-user folder */
    const folder = `edusync/users/${uid}/${type}s`

    const buffer = Buffer.from(await file.arrayBuffer())
    const originalName = file.name.replace(/\.[^/.]+$/, "")

    /* 4️⃣ Upload to Cloudinary */
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: originalName,
          resource_type: type === "pdf" ? "raw" : "video",
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        },
        (err, res) => {
          if (err) reject(err)
          else resolve(res)
        }
      ).end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      name: file.name,
      uid,
    })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
