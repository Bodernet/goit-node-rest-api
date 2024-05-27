import { Contact } from "../schemas/contactsSchemas.js";

export async function getAllContacts(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const limitNumber = parseInt(limit, 10);
    const result = await Contact.find({ owner: req.user.id })
      .skip(skip)
      .limit(limitNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getOneContact(req, res) {
  const { id } = req.params;
  try {
    const result = await Contact.findOne({ _id: id, owner: req.user.id });
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
    const result = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
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
    const result = await Contact.create({ ...bodyContact, owner: req.user.id });
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
    const result = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      bodyContact,
      {
        new: true,
      }
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateStatusContact(req, res) {
  const { id } = req.params;
  const { favorite } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      { _id: id },
      { favorite },
      {
        new: true,
      }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
