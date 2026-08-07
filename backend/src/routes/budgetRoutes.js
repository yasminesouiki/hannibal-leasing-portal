const express = require("express");
const { getBudget, updateBudget } = require("../controllers/budgetController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, getBudget);
router.patch("/", requireAuth, requireRole("admin"), updateBudget);

module.exports = router;
