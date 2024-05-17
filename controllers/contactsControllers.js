import { Contact } from "../schemas/contactsSchemas.js";

export async function getAllContacts(req, res) {
  try {
    const result = await Contact.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getOneContact(req, res) {
  const { id } = req.params;
  try {
    const result = await Contact.findById(id);
    if (result === null) {
      return res.status(404).send({ message: "Not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteContact(req, res) {
  const { id } = req.params;
  try {
    const result = await Contact.findByIdAndDelete(id);
    if (result === null) {
      return res.status(404).send({ message: "Not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createContact(req, res) {
  const bodyContact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  try {
    const result = await Contact.create(bodyContact);
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateContact(req, res) {
  const { id } = req.params;
  try {
    const bodyContact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
    };
    const result = await Contact.findByIdAndUpdate(id, bodyContact, {
      new: true,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateStatusContact(req, res) {
  const { id } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== "boolean") {
    return res.status(400).json({ message: "Favorite must be a boolean" });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      {
        new: true,
      }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
