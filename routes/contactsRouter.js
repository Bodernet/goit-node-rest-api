import express from "express";
import mongoose from "mongoose";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: "Not found" });
  }
  next(); //
};

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", validateObjectId, getOneContact);

contactsRouter.delete("/:id", validateObjectId, deleteContact);

contactsRouter.post("/", createContactSchema, createContact);

contactsRouter.put(
  "/:id",
  validateObjectId,
  updateContactSchema,
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateObjectId,
  updateFavoriteSchema,
  updateStatusContact
);
export default contactsRouter;
