const express = require("express");
const {
  createExpense,
  listMyExpenses,
  listExpenses,
  updateExpenseStatus,
  getExpenseById,
} = require("../controllers/expenseController");
const { requireAuth, requireRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", requireAuth, upload.single("justificatif"), createExpense);
router.get("/mine", requireAuth, listMyExpenses);
router.get("/", requireAuth, requireRole("admin"), listExpenses);
router.patch("/:id/status", requireAuth, requireRole("admin"), updateExpenseStatus);
router.get("/:id", requireAuth, getExpenseById);

module.exports = router;
