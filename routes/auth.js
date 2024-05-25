import express from "express";
import { register, login, logout, current } from "../controllers/users.js";
import authMiddleware from "../middlewares/auth.js";
import { registerSchema, loginSchema } from "../schemas/user.js";

const authRouter = express.Router();

authRouter.post("/register", registerSchema, register);
authRouter.post("/login", loginSchema, login);
authRouter.get("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, current);

export default authRouter;
