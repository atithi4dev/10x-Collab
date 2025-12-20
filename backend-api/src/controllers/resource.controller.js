import fs from "fs";
import { isValidObjectId } from "mongoose";
import { Resource } from "../models/resource.models.js";
import { ApiError } from "../utils/api-utils/ApiError.js";
import { ApiResponse } from "../utils/api-utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/assets-utils/Cloudinary.js";

// Create Resource (TEXT or FILE)
export const createResource = async (req, res, next) => {
  try {
    const { title, description, type, content, tags, roomId } = req.body;
    const userId = req.user?._id;
    
    if (!isValidObjectId(roomId)) {
      throw new ApiError(400, "Valid roomId required");
    }

    if (!userId || !isValidObjectId(userId)) {
      throw new ApiError(400, "Valid user is required");
    }

    if (!title?.trim()) throw new ApiError(400, "Title is required");

    const allowedTypes = ["LINK", "IMAGE", "VIDEO", "NOTE", "API", "FILE", "CREDENTIALS"];
    if (!type || !allowedTypes.includes(type)) {
      throw new ApiError(400, "Invalid resource type");
    }

    // Validation rules for specific types
    if ((type === "API" || type === "NOTE") && (!content?.trim() || !description?.trim())) {
      throw new ApiError(400, `${type} resources require both description and content`);
    }

    let fileUrl = null;
    let publicId = null;

    // File upload only for FILE, IMAGE, VIDEO
    if (["FILE", "IMAGE", "VIDEO"].includes(type)) {
      if (!req.file) throw new ApiError(400, "File is required for this resource type");

      const uploadType = type === "VIDEO" ? "video" : "image";
      const uploaded = await uploadOnCloudinary(req.file.path, uploadType);

      if (!uploaded?.url) throw new ApiError(500, "File upload failed");

      fileUrl = uploaded.url;
      publicId = uploaded.public_id;

      // Cleanup local temp file
      if (req.file?.path) {
        try { await fs.promises.unlink(req.file.path); } catch { }
      }
    }

    const resource = await Resource.create({
      title: title.trim(),
      description: description?.trim() || null,
      type,
      content: content?.trim() || null,
      fileUrl,
      publicId,
      room: roomId,
      owner: userId,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
    });

    return res.status(201).json(new ApiResponse(201, resource, "Resource created successfully"));
  } catch (error) {
    // Rollback cloud if failed
    if (req.file?.path) try { await fs.promises.unlink(req.file.path); } catch { }
    if (error.publicId) await deleteFromCloudinary(error.publicId);
    next(error);
  }
};


// Get all resources
export const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.aggregate([
      {
        $match: {
          owner: req.user._id, // or addedBy: req.user._id if that’s your field
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "users", // collection name in MongoDB
          localField: "owner", // field in Resource
          foreignField: "_id", // field in User
          as: "ownerInfo",
        },
      },
      {
        $unwind: "$ownerInfo", // converts array from $lookup into single object
      },
      {
        $project: {
          title: 1,
          description: 1,
          type: 1,
          content: 1,
          fileUrl: 1,
          tags: 1,
          isPinned: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: {
            _id: "$ownerInfo._id",
            userName: "$ownerInfo.userName",
            email: "$ownerInfo.email",
            avatar: "$ownerInfo.avatar",
          },
        },
      },
    ]);
    return res.status(200).json(new ApiResponse(200, resources, "Resources fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// Delete resource by ID
export const deleteResource = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    if (!isValidObjectId(resourceId)) throw new ApiError(400, "Invalid resource ID");

    const resource = await Resource.findById(resourceId);
    if (!resource) throw new ApiError(404, "Resource not found");

    if (resource.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to delete this resource");
    }

    // Delete cloud file if FILE
    if (resource.type === "FILE" && resource.publicId) {
      await deleteFromCloudinary(resource.publicId);
    }

    await Resource.findByIdAndDelete(resourceId);

    return res.status(200).json(new ApiResponse(200, null, "Resource deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// Toggle pin/unpin
export const togglePin = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    if (!isValidObjectId(resourceId)) throw new ApiError(400, "Invalid resource ID");

    const resource = await Resource.findById(resourceId);
    if (!resource) throw new ApiError(404, "Resource not found");

    if (resource.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to modify this resource");
    }

    resource.isPinned = !resource.isPinned;
    await resource.save();

    return res.status(200).json(new ApiResponse(200, resource, "Pin status updated"));
  } catch (error) {
    next(error);
  }
};

// Search resources (title, type, tags)
export const searchResources = async (req, res, next) => {
  try {
    const { q, type, tag } = req.query;

    const query = { owner: req.user._id };

    if (q) query.title = { $regex: q, $options: "i" };
    if (type && ["TEXT", "FILE"].includes(type)) query.type = type;
    if (tag) query.tags = tag;

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, resources, "Resources search results"));
  } catch (error) {
    next(error);
  }
};
