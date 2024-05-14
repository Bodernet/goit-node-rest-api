import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updContact,
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
  const { error } = createContactSchema.validate(bodyContact, {
    abortEarly: false,
  });
  if (error) {
    return res
      .status(400)
      .json(error.details.map((error) => error.message).join(", "));
  }
  addContact(req.body)
    .then((contact) => {
      res.status(201).json(contact);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const updateContact = (req, res) => {
  const id = req.params.id;
  const contact = req.body;

  if (!Object.keys(contact).length) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  const { error } = updateContactSchema.validate(contact, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  updContact(id, contact)
    .then((updatedContact) => {
      if (updatedContact) {
        res.status(200).json(updatedContact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
