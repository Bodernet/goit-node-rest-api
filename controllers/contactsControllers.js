import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import crypto from "node:crypto";

export const getAllContacts = (req, res) => {
  listContacts()
    .then((contacts) => res.status(200).json(contacts))
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const getOneContact = (req, res) => {
  getContactById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const deleteContact = (req, res) => {
  removeContact(req.params.id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const createContact = (req, res) => {
  const bodyContact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  const { error, value } = createContactSchema.validate(bodyContact, {
    abortEarly: false,
  });
  if (typeof error !== "undefined") {
    return res
      .status(400)
      .send(
        error.details
          .map((error) => error.message)
          .join({ message: err.message })
      );
  }
  addContact(req.body)
    .then((contact) => {
      res.status(201).json({
        id: crypto.randomUUID(),
        name: value.name,
        email: value.email,
        phone: value.phone,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const updateContact = (req, res) => {
  if (!Object.keys(req.body).length) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }
  const { error } = updateContactSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  updateContact(req.params.id, req.body)
    .then((updatedContact) => {
      if (updatedContact) {
        res.status(200).json(updatedContact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
