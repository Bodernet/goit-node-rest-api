import jwt from "jsonwebtoken";
import { User } from "../schemas/user.js";

async function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader !== "string") {
    return res.status(401).send({ message: "Not authorized 1!" });
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized 2!" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
    if (error) {
      return res.status(401).json({ message: "Not authorized 0!" });
    }
    try {
      const user = await User.findById(decode.id);

      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized 3!" });
      }

      req.user = { id: user._id, email: user.email };
      next();
    } catch (error) {
      console.log("Authorization error:", error);
      return res.status(401).json({ message: "Not authorized 4!" });
    }
  });
}
export default authMiddleware;
