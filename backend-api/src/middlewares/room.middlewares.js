import Room from '../models/room.models.js'
export const ensureRoomMember = async (req, res, next) => {
  const { roomId } = req.params;
  const userId = req.user._id;

  const room = await Room.findOne({ roomId });
  if (!room) throw new ApiError(404, "Room not found");

  if (!room.members.includes(userId)) {
    throw new ApiError(403, "Not a room member");
  }

  req.room = room;
  next();
};
