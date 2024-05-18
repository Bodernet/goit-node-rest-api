import Joi from "joi";
import mongoose from "mongoose";

export const createContactSchema = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const updateContactSchema = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const updateFavoriteSchema = (req, res, next) => {
  const schema = Joi.object({
    // name: Joi.string(),
    // email: Joi.string(),
    // phone: Joi.string(),
    favorite: Joi.boolean().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

export const Contact = mongoose.model("Contact", contactSchema);
