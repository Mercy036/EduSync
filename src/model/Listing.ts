import mongoose, { Schema, model, models } from "mongoose";

const ListingSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Stores the Cloudinary URL
    sellerName: { type: String, required: true },
    sellerId: { type: String, required: true }, // The Firebase UID of the seller
    sellerJoined: { type: String, default: () => new Date().getFullYear().toString() },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Check if model exists to prevent overwrite error during hot reload
const Listing = models.Listing || model("Listing", ListingSchema);

export default Listing;