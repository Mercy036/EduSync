import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/src/lib/firebaseAdmin";
import dbConnect from "@/src/lib/dbConnect"; 
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export async function POST(req: Request) {
  try {
    await dbConnect();

    const header = req.headers.get("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = header.split("Bearer ")[1];
    
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { items, total } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const newOrder = await Order.create({
      userId: decodedToken.uid,
      userEmail: decodedToken.email,
      items,
      total,
    });

    return NextResponse.json({ 
      success: true, 
      orderId: newOrder._id,
      message: "Order placed successfully via MongoDB" 
    });

  } catch (error: any) {
    console.error("MongoDB Order Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}