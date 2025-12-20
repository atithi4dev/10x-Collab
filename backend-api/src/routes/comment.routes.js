import { Router } from "express";
import {
  addTweetComment,
  deleteComment,
  getTweetComments,
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJwt);

router.route("/tweets/:tweetId/comments")
.get(getTweetComments)
.post(addTweetComment);

router.route("/comments/:commentId")
.delete(deleteComment)


export default router;
