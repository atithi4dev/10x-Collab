import { Router } from "express";
import {
  logoutUser,
  registerUser,
  loginUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();

// Unsecured User
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

// secure routes :

router.route("/logout").post(verifyJwt, logoutUser);
router.route("/change-password").post(verifyJwt,changeCurrentPassword)
router.route("/me").get(verifyJwt,getCurrentUser)
router.route("/update-account").patch(verifyJwt, updateAccountDetails)
router.route("/avatar").patch(
  verifyJwt,
  upload.single("avatar"),
  updateUserAvatar
);
router.route("/cover-image").patch(
  verifyJwt,
  upload.single("coverImage"),
  updateUserCoverImage
);

export default router;
