import { Router } from "express";
import { createRoom, joinRoom } from "../controllers/room.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJwt);

router.post("/", createRoom);
router.post("/join", joinRoom);

export default router;
