import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbConnect"; // Your existing db connection
import Listing from "@/src/model/Listing";
import cloudinary from "@/src/lib/cloudinary"; // Your existing cloudinary config
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"; // Your existing firebase admin

// Helper function to upload file buffer to Cloudinary
async function uploadToCloudinary(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "edusync/marketplace" }, // Folder in Cloudinary
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result?.secure_url || "");
      }
    ).end(buffer);
  });
}

// GET: Fetch all listings
export async function GET() {
  try {
    await dbConnect();
    // Fetch listings sorted by newest first
    const listings = await Listing.find().sort({ createdAt: -1 });
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Fetch Listings Error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

// POST: Create a new listing (Protected Route)
export async function POST(req: Request) {
  try {
    // 1. Authenticate User
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    
    // Extract user info from token
    const sellerId = decodedToken.uid;
    const sellerName = decodedToken.name || decodedToken.email?.split("@")[0] || "Student";

    // 2. Parse Form Data
    const formData = await req.formData();
    const title = formData.get("title");
    const price = formData.get("price");
    const category = formData.get("category");
    const location = formData.get("location");
    const description = formData.get("description");
    const imageFile = formData.get("image") as File;

    if (!imageFile || !title || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Upload Image to Cloudinary
    const imageUrl = await uploadToCloudinary(imageFile);

    // 4. Save to MongoDB
    await dbConnect();
    
    const newListing = await Listing.create({
      title,
      price,
      category,
      location,
      description,
      image: imageUrl,
      sellerName,
      sellerId,
      // sellerJoined default is handled in Schema
    });

    return NextResponse.json(newListing, { status: 201 });

  } catch (error) {
    console.error("Create Listing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}