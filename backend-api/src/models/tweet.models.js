import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "BLOCKED", "DONE"],
      default: "IN_PROGRESS",
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tweet", tweetSchema);