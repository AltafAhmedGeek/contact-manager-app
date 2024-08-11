const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  createContact,
  getSingleContact,
  updateContact,
  deleteContact,
} = require("../controller/contactController");
const validateJwtToken = require("../middleware/validateTokenHandler");

router.use(validateJwtToken);
router.route("/").get(getAllContacts);
router.route("/").post(createContact);
router.route("/:id").get(getSingleContact);
router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

module.exports = router;
