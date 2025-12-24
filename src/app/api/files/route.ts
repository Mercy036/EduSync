import { NextResponse } from "next/server"
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") as "pdf" | "video"

    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json([], { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken)
    const uid = decoded.uid

    const folder = `edusync/users/${uid}/${type}s`

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute()

    const files = result.resources.map((r: any) => ({
      id: r.public_id,
      name: r.filename,
      url: r.secure_url,
    }))

    return NextResponse.json(files)
  } catch (err) {
    console.error("File fetch error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const id = body.id as string
    const type = body.type as "pdf" | "video"

    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken)
    const uid = decoded.uid

    if (!id || !type) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const expectedPrefix = `edusync/users/${uid}/${type}s/`
    if (!id.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const resourceType = type === "pdf" ? "raw" : "video"

    const result = await cloudinary.uploader.destroy(id, { resource_type: resourceType })

    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error("File delete error:", err)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
