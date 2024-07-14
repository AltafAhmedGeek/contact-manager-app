const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { constants } = require("../constants");
//@desc Get all contacts
//@route GET /api/contacts
//@access public

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  return res
    .status(200)
    .json({ status: true, data: contacts, message: `All Contacts Found.` });
});

//@desc Create a new Contact
//@route POST /api/contacts
//@access public

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!(name && email && phone)) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All Fields are Required");
  }
  const contact = Contact.create({
    name,
    email,
    phone,
  });
  return res.status(201).json({
    status: true,
    message: `Contact Created Successfully.`,
    data: contact,
  });
});

//@desc Get a Contact
//@route GET /api/contacts/:id
//@access public

const getSingleContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("Contact not found. ");
  }
  return res.status(200).json({
    status: true,
    message: `Contact Found, ID : ${req.params.id}`,
    data: contact,
  });
});

//@desc Update a Contact
//@route PUT /api/contacts/:id
//@access public

const updateContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!(name && email && phone)) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All Fields are Required");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  return res.status(200).json({
    status: true,
    message: `Contact Updated Successfully, ID : ${req.params.id}`,
    data: updateContact,
  });
});

//@desc Delete a Contact
//@route DELETE /api/contacts/:id
//@access public

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("Contact not found. ");
  }
  await Contact.remove();
  return res.status(200).json({
    status: true,
    message: `Contact Deleted Successfully, ID: ${req.params.id}`,
  });
});

module.exports = {
  getAllContacts,
  createContact,
  getSingleContact,
  updateContact,
  deleteContact,
};
