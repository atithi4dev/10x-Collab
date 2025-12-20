import mongoose from "mongoose";
import Tweet from "../models/tweet.models.js";
import { ApiError } from "../utils/api-utils/ApiError.js";
import { ApiResponse } from "../utils/api-utils/ApiResponse.js";
import { asyncHandler } from "../utils/api-utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { roomId } = req.params;
  const owner = req.user._id;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw new ApiError(400, "Invalid room ID");
  }

  const tweet = await Tweet.create({
    content,
    owner,
    room: roomId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getRoomTweets = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw new ApiError(400, "Invalid room ID");
  }

  const tweets = await Tweet.aggregate([
    {
      $match: {
        room: new mongoose.Types.ObjectId(roomId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "targetId",
        as: "likes",
        pipeline: [
          {
            $match: {
              targetType: "Tweet",
              likedBy: new mongoose.Types.ObjectId(req.user._id),
            },
          },
        ],
      },
    },
    {
      $project: {
        content: 1,
        status: 1,
        createdAt: 1,
        "user.username": 1,
        "user.avatar": 1,
        liked: { $gt: [{ $size: "$likes" }, 0] },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Room tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  tweet.content = content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const updateTweetStatus = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  const allowedStatus = ["PENDING", "IN_PROGRESS", "BLOCKED", "DONE"];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid tweet status");
  }

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  tweet.status = status;
  await tweet.save();

  if (status === "DONE") {
    console.log(
      `🔔 Tweet DONE | tweetId=${tweet._id} | room=${tweet.room}`
    );
  }

  return res.status(200).json(
    new ApiResponse(200, tweet, "Tweet status updated", {
      notification:
        status === "DONE"
          ? "Tweet marked as DONE (temporary notification)"
          : null,
    })
  );
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  await tweet.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export {
  createTweet,
  getRoomTweets,
  updateTweet,
  updateTweetStatus,
  deleteTweet,
};
