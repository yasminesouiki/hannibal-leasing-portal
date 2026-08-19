const express = require("express");
const {
  listContacts,
  listInbox,
  listSent,
  sendMessage,
  markRead,
} = require("../controllers/messageController");
const { requireAuth, requireRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(requireAuth, requireRole("admin", "rh"));

router.get("/contacts", listContacts);
router.get("/inbox", listInbox);
router.get("/sent", listSent);
router.post("/", upload.single("attachment"), sendMessage);
router.patch("/:id/read", markRead);

module.exports = router;
