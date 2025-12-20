import { Router } from "express";
import {
  createResource,
  getResources,
  deleteResource,
  togglePin,
  searchResources,
} from "../controllers/resource.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();
router.use(verifyJwt)

router
  .route("/search")
  .get(verifyJwt, searchResources);

router
  .route("/")
  .get(getResources)
  .post(upload.single("file"), createResource);

// Pin toggle
router.patch("/:resourceId/pin", togglePin);

// Delete
router.delete("/:resourceId", deleteResource);



export default router;
