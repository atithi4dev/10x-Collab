import mongoose, { isValidObjectId } from "mongoose";
import Comment from "../models/comment.models.js";
import { ApiError } from "../utils/api-utils/ApiError.js";
import { ApiResponse } from "../utils/api-utils/ApiResponse.js";
import { asyncHandler } from "../utils/api-utils/asyncHandler.js";

const getTweetComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Please provide a valid tweet ID");
  }

  const pipeline = [
    {
      $match: {
        tweet: new mongoose.Types.ObjectId(tweetId),
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweet",
      },
    },
    { $unwind: "$tweet" },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
        "tweet._id": 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  const comments = await Comment.aggregatePaginate(pipeline, options);

  return res.status(200).json(
    new ApiResponse(200, {
      comments: comments.docs,
      totalComments: comments.totalDocs,
      page: comments.page,
      limit: comments.limit,
      totalPages: comments.totalPages,
    }, "Comments fetched successfully")
  );
});


const addTweetComment = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const owner = req.user._id;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Please provide a tweet tweet ID");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content cannot be empty");
  }
  const tweet = await Tweet.findById(tweetId)
  const comment = await Comment.create({
    tweet: new mongoose.Types.ObjectId(tweetId),
    owner: new mongoose.Types.ObjectId(owner),
    room: tweet.room,
    content: content.trim(),
  });

  if (!comment) {
    throw new ApiError(500, "Failed to add comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});


const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Please provide a valid comment ID");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (req.user._id.toString() !== comment.owner.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});

export {
  getTweetComments, addTweetComment, deleteComment
};





