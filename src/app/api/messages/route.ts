import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbConnect";
import Message from "@/src/model/Message";
import { firebaseAdmin } from "@/src/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    
    const { receiverId, listingId, content } = await req.json();

    // --- FIX: Handle Mock Data Gracefully ---
    // If it's a mock listing (ID starts with 'mock-'), don't save to DB.
    // Just return success so the UI works.
    if (typeof listingId === 'string' && listingId.startsWith('mock-')) {
      return NextResponse.json({ success: true, mock: true });
    }

    await dbConnect();
    await Message.create({
      senderId: decodedToken.uid,
      senderName: decodedToken.name || decodedToken.email?.split("@")[0] || "Student",
      receiverId,
      listingId, // This must be a valid MongoDB ObjectId for real items
      content,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Message Error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}