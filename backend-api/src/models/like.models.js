import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    targetType: {
      type: String,
      enum: ["Tweet"],
      required: true, 
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ likedBy: 1, targetType: 1, targetId: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);
