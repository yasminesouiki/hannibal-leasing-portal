const express = require("express");
const {
  signup,
  login,
  adminLoginStep1,
  adminVerify,
  adminResendCode,
  rhLogin,
  getMe,
  listUsers,
  updateUserStatus,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { requireAuth, requireRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/admin/login", adminLoginStep1);
router.post("/admin/verify", adminVerify);
router.post("/admin/resend-code", adminResendCode);

router.post("/rh/login", rhLogin);

router.get("/me", requireAuth, getMe);
router.put("/profile", requireAuth, upload.single("photo"), updateProfile);
router.post("/change-password", requireAuth, changePassword);

router.get("/admin/users", requireAuth, requireRole("admin"), listUsers);
router.patch("/admin/users/:id/status", requireAuth, requireRole("admin"), updateUserStatus);

module.exports = router;
