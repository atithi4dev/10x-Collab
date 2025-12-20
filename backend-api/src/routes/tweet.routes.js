import { Router } from "express";
import {
  createTweet,
  getRoomTweets,
  updateTweet,
  updateTweetStatus,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { ensureRoomMember } from "../middlewares/room.middlewares.js";

const router = Router();
router.use(verifyJwt);

router.post("/:roomId", ensureRoomMember, createTweet);
router.get("/:roomId", ensureRoomMember, getRoomTweets);
router.patch("/:tweetId", updateTweet);
router.patch("/:tweetId/status", updateTweetStatus);
router.delete("/:tweetId", deleteTweet);

export default router;
