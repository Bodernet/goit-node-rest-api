import bcrypt from "bcrypt";
import User from "../schemas/user.js";
import { token } from "morgan";

export async function register(req, res, next) {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({ email, password: passwordHash });

    res.status(201).json("Registration successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password " });
    }
    res.send({ token: "TOKEN" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
