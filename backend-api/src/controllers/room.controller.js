import crypto from "crypto";
import Room from "../models/room.models.js";
import { asyncHandler } from "../utils/api-utils/asyncHandler.js";
import { ApiError } from "../utils/api-utils/ApiError.js";
import { ApiResponse } from "../utils/api-utils/ApiResponse.js";

const generateId = () => crypto.randomBytes(4).toString("hex");

export const createRoom = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Room name required");
  }

  const room = await Room.create({
    name: name.trim(),
    roomId: generateId(),          // e.g. ab12cd
    inviteCode: generateId(),      // e.g. x9k3m2
    leader: userId,
    members: [userId],
  });

  const roomLink = `${process.env.FRONTEND_URL}/room/${room.inviteCode}`;

  return res.status(201).json(
    new ApiResponse(201, {
      roomId: room.roomId,
      inviteLink: roomLink,
      room,
    }, "Room created")
  );
});

export const joinRoom = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { roomId, inviteCode } = req.body;

  const room = await Room.findOne({
    $or: [{ roomId }, { inviteCode }],
  });

  if (!room) throw new ApiError(404, "Room not found");

  if (!room.members.includes(userId)) {
    room.members.push(userId);
    await room.save();
  }

  return res.status(200).json(
    new ApiResponse(200, room, "Joined room successfully")
  );
});
