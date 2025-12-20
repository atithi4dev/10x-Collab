import { Router } from 'express';
import {
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyJwt} from "../middlewares/auth.middlewares.js"

const router = Router();
router.use(verifyJwt);

router.route("/toggle/t/:tweetId").post(toggleTweetLike);

export default router