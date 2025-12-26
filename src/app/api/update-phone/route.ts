import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/src/lib/firebaseAdmin";
import dbConnect from "@/src/lib/dbConnect";
import { UserModel } from "@/src/model/user.model";

export async function POST(req: Request) {
  try {
    const { idToken, phoneNo } = await req.json();

    if (!idToken || !phoneNo) {
      return NextResponse.json({ error: "Missing token or phone number" }, { status: 400 });
    }
    
    // Basic India Phone Validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNo)) {
      return NextResponse.json({ error: "Invalid Indian phone number" }, { status: 400 });
    }

    // Verify User
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    await dbConnect();

    // Update MongoDB
    const user = await UserModel.findOneAndUpdate(
      { uid },
      { phoneNo },
      { new: true, upsert: true } // Create if doesn't exist
    );

    return NextResponse.json({ success: true, user });

  } catch (error: any) {
    console.error("Phone update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}