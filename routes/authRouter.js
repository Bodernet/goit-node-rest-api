import express from "express";
import {
  register,
  login,
  logout,
  current,
  updSubscription,
} from "../controllers/usersControllers.js";
import authMiddleware from "../middlewares/auth.js";
import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", registerSchema, register);
authRouter.post("/login", loginSchema, login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, current);
authRouter.patch("/", authMiddleware, subscriptionSchema, updSubscription);

export default authRouter;
