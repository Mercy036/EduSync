import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/src/lib/firebaseAdmin";
import dbConnect from "@/src/lib/dbConnect";
import { UserModel } from "@/src/model/user.model";

export async function GET(req: Request) {
  try {
    const header = req.headers.get("Authorization");
    if (!header) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = header.split("Bearer ")[1];
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    await dbConnect();
    const user = await UserModel.findOne({ uid: decoded.uid });

    return NextResponse.json({ 
      success: true, 
      user: user || {} 
    });

  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}