import express from "express";
import {
  askToAssistant,
  getCurrentUser,
  updateUserProfile,
} from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
const userRouter = express.Router();

userRouter.get("/current", getCurrentUser);
userRouter.post("/update-profile", isAuth, upload.single("assistantImage"), updateUserProfile);
userRouter.post("/asktoassistant", isAuth, askToAssistant);

export default userRouter;
