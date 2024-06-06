import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { User } from "../schemas/usersSchemas.js";
import jwt from "jsonwebtoken";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import fs from "fs/promises";
import mail from "../mailtrap/mail.js";

export async function register(req, res, next) {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = crypto.randomUUID();
    mail.sendMail({
      to: email,
      from: "bodernet@meta.ua",
      subject: "Welcome to contact",
      html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">Link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });
    const postNewUser = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    res.status(201).json({
      user: {
        email: postNewUser.email,
        subscription: postNewUser.subscription,
      },
    });
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
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    if (user.verify === false) {
      return res.status(404).send({ message: "User not found" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 3000 }
    );
    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.status(200).json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function current(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).send("Not authorized");
    }
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    res.status(401).json("Not authorized");
  }
}

export async function updSubscription(req, res, next) {
  try {
    if (
      Object.keys(req.body).length !== 1 ||
      !["starter", "pro", "business"].includes(req.body.subscription)
    ) {
      return res.status(400).send({ message: "Choose a new subscription" });
    }
    const newSubscription = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(newSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "You must add a file" });
    }
    const newPath = path.resolve("public", "avatars", req.file.filename);
    const avaURL = path.join("avatars", req.file.filename);
    Jimp.read(req.file.path)
      .then((file) => {
        return file.resize(250, 250).quality(60).write(newPath);
      })
      .catch((err) => {
        console.error(err);
      });

    await fs.rename(req.file.path, newPath);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: avaURL },
      { new: true }
    );
    if (user) {
      res.status(200).json({
        avatarURL: user.avatarURL,
      });
    } else {
      return res.status(404).json("Not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (user === null) {
      return res.status(404).json("User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).json("Verification successful");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify === true) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    const verificationToken = crypto.randomUUID();
    mail.sendMail({
      to: email,
      from: "bodernet@meta.ua",
      subject: "Welcome to contact",
      html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">Link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
