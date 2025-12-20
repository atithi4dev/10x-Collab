import mongoose from "mongoose";
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    type: {
      type: String,
      enum: ["LINK", "IMAGE", "VIDEO", "NOTE", "API", "FILE", "CREDENTIALS"],
      required: true,
    },

    content: {
      type: String,
      trim: true,
      default: null,
    },

    fileUrl: {
      type: String,
      default: null,
    },

    publicId: {
      type: String,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Resource = mongoose.model("Resource", resourceSchema);
