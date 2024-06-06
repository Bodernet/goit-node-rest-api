import express from "express";
import {
  register,
  login,
  logout,
  current,
  updSubscription,
  updAvatar,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/usersControllers.js";
import authMiddleware from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";
import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  verifySchema,
} from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", registerSchema, register);
authRouter.post("/login", loginSchema, login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, current);
authRouter.patch("/", authMiddleware, subscriptionSchema, updSubscription);
authRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  updAvatar
);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/verify", verifySchema, resendVerificationEmail);

export default authRouter;
