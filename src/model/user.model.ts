import mongoose, { Schema, Document } from "mongoose"

/* ---------- Sub-schema: YouTube Links ---------- */
export interface YouTubeLink {
  title: string
  url: string
  addedAt: Date
}

const YouTubeLinkSchema = new Schema<YouTubeLink>({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

/* ---------- Main User Interface ---------- */
export interface User extends Document {
  uid: string            // Firebase UID (primary identity)
  name?: string
  email?: string
  avatar?: string
  youtubeLinks: YouTubeLink[]
  createdAt: Date
  updatedAt: Date
}

/* ---------- User Schema ---------- */
const UserSchema = new Schema<User>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    avatar: {
      type: String,
    },

    youtubeLinks: {
      type: [YouTubeLinkSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
)

/* ---------- Model Export ---------- */
export const UserModel =
  mongoose.models.User ||
  mongoose.model<User>("User", UserSchema)
