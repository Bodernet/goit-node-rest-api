import jwt from "jsonwebtoken";

import { User } from "../schemas/user.js";

async function authMiddleware(req, res) {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader !== "string") {
    return res.status(401).send({ message: "Not authorized!" });
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized!" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    req.user = { id: user._id, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized!" });
  }
}

export default authMiddleware;
