import { NextResponse } from "next/server"
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"
import dbConnect from "@/src/lib/dbConnect"
import { UserModel } from "@/src/model/user.model"

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json()

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing ID token" },
        { status: 400 }
      )
    }

    const decodedToken = await firebaseAdmin
      .auth()
      .verifyIdToken(idToken)

    const { uid, email, name, picture } = decodedToken

    await dbConnect()

    const user = await UserModel.findOneAndUpdate(
      { uid },
      {
        $setOnInsert: {
          uid,
          email,
          name,
          avatar: picture,
        },
      },
      {
        new: true,
        upsert: true,
      }
    )

    const hasPhone = Boolean(user.phoneNo)

    return NextResponse.json({
      success: true,
      user,
      redirectTo: hasPhone ? "/dashboard" : "/complete-profile",
    })
  } catch (error) {
    console.error("Firebase auth error:", error)

    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    )
  }
}
