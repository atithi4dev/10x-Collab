import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true, // human-readable ID
    },

    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },

    leader: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
