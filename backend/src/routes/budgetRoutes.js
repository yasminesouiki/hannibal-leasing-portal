const express = require("express");
const { getBudget, updateBudget, getMyBudget } = require("../controllers/budgetController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, getBudget);
router.get("/mine", requireAuth, requireRole("user"), getMyBudget);
router.patch("/", requireAuth, requireRole("admin"), updateBudget);

module.exports = router;
