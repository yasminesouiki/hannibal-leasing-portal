const bcrypt = require("bcryptjs");
const pool = require("../data/db");
const { verificationCodes } = require("../data/store");
const { signToken } = require("../utils/token");
const { generateCode, CODE_TTL_MS } = require("../utils/code");
const { sendVerificationCode } = require("../utils/mailer");

const findByEmailAndRole = async (email, role) => {
  const [rows] = await pool.query(
    "SELECT * FROM accounts WHERE email = ? AND role = ?",
    [email, role]
  );
  return rows[0] || null;
};

// ---- UTILISATEUR ----

const signup = async (req, res) => {
  const { nom, prenom, email, password, poste } = req.body;

  if (!nom || !prenom || !email || !password || !poste) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  const [existing] = await pool.query("SELECT id FROM accounts WHERE email = ?", [email]);
  if (existing.length > 0) {
    return res.status(409).json({ message: "Cet email est déjà utilisé" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO accounts (nom, prenom, email, password_hash, poste, role, status) VALUES (?, ?, ?, ?, ?, 'user', 'pending')",
    [nom, prenom, email, passwordHash, poste]
  );

  res.status(201).json({ message: "Compte créé. En attente de validation par l'administrateur." });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findByEmailAndRole(email, "user");

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  if (user.status === "pending") {
    return res.status(403).json({ message: "Votre compte est en attente de validation par l'administrateur" });
  }
  if (user.status === "rejected") {
    return res.status(403).json({ message: "Votre demande de compte a été refusée" });
  }

  const token = signToken({ id: user.id, role: user.role });
  res.json({
    token,
    user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, poste: user.poste, role: user.role },
  });
};

// ---- ADMIN (2 étapes, code envoyé par email) ----

const adminLoginStep1 = async (req, res) => {
  const { email, password } = req.body;
  const admin = await findByEmailAndRole(email, "admin");

  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  const code = generateCode();
  verificationCodes.set(`admin:${email}`, { code, expiresAt: Date.now() + CODE_TTL_MS });
  await sendVerificationCode(email, code);

  res.json({ message: "Code de vérification envoyé" });
};

const adminVerify = async (req, res) => {
  const { email, code } = req.body;
  const entry = verificationCodes.get(`admin:${email}`);

  if (!entry || entry.expiresAt < Date.now() || entry.code !== code) {
    return res.status(400).json({ message: "Code incorrect ou expiré" });
  }

  verificationCodes.delete(`admin:${email}`);
  const admin = await findByEmailAndRole(email, "admin");
  const token = signToken({ id: admin.id, role: admin.role });
  res.json({ token, admin: { id: admin.id, email: admin.email, role: admin.role } });
};

const adminResendCode = async (req, res) => {
  const { email } = req.body;
  const admin = await findByEmailAndRole(email, "admin");
  if (!admin) {
    return res.status(404).json({ message: "Administrateur introuvable" });
  }

  const code = generateCode();
  verificationCodes.set(`admin:${email}`, { code, expiresAt: Date.now() + CODE_TTL_MS });
  await sendVerificationCode(email, code);

  res.json({ message: "Code renvoyé" });
};

// ---- RESSOURCES HUMAINES (connexion directe, sans code pour l'instant) ----

const rhLogin = async (req, res) => {
  const { email, password } = req.body;
  const rhUser = await findByEmailAndRole(email, "rh");

  if (!rhUser || !(await bcrypt.compare(password, rhUser.password_hash))) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  const token = signToken({ id: rhUser.id, role: rhUser.role });
  res.json({ token, rh: { id: rhUser.id, email: rhUser.email, role: rhUser.role } });
};

// ---- GESTION DES COMPTES UTILISATEURS (admin) ----

const listUsers = async (req, res) => {
  const status = ["pending", "accepted", "rejected"].includes(req.query.status)
    ? req.query.status
    : "pending";

  const [rows] = await pool.query(
    "SELECT id, nom, prenom, email, poste, photo, status, created_at FROM accounts WHERE role = 'user' AND status = ? ORDER BY created_at DESC",
    [status]
  );
  res.json({ users: rows });
};

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  if (status === "accepted") {
    const [budgetRows] = await pool.query("SELECT montant FROM budget WHERE id = 1");
    const [result] = await pool.query(
      "UPDATE accounts SET status = ?, budget_restant = ? WHERE id = ? AND role = 'user'",
      [status, budgetRows[0]?.montant ?? 0, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    return res.json({ message: "Statut mis à jour" });
  }

  const [result] = await pool.query(
    "UPDATE accounts SET status = ? WHERE id = ? AND role = 'user'",
    [status, id]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  res.json({ message: "Statut mis à jour" });
};

// ---- PROFIL (route protégée) ----

const getMe = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, nom, prenom, email, poste, telephone, lieu, photo, role FROM accounts WHERE id = ?",
    [req.auth.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ message: "Compte introuvable" });
  }
  res.json({ user: rows[0] });
};

const updateProfile = async (req, res) => {
  const { nom, prenom, email, telephone, lieu, poste } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  const fields = [];
  const values = [];
  if (nom) { fields.push("nom = ?"); values.push(nom); }
  if (prenom) { fields.push("prenom = ?"); values.push(prenom); }
  if (email) { fields.push("email = ?"); values.push(email); }
  if (telephone !== undefined) { fields.push("telephone = ?"); values.push(telephone); }
  if (lieu !== undefined) { fields.push("lieu = ?"); values.push(lieu); }
  if (poste !== undefined && req.auth.role === "user") { fields.push("poste = ?"); values.push(poste); }
  if (photo) { fields.push("photo = ?"); values.push(photo); }

  if (fields.length === 0) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
  }

  values.push(req.auth.id);
  await pool.query(`UPDATE accounts SET ${fields.join(", ")} WHERE id = ?`, values);

  const [rows] = await pool.query(
    "SELECT id, nom, prenom, email, poste, telephone, lieu, photo, role FROM accounts WHERE id = ?",
    [req.auth.id]
  );
  res.json({ user: rows[0] });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Mot de passe actuel et nouveau requis" });
  }

  const [rows] = await pool.query("SELECT password_hash FROM accounts WHERE id = ?", [req.auth.id]);
  const account = rows[0];
  if (!account || !(await bcrypt.compare(currentPassword, account.password_hash))) {
    return res.status(401).json({ message: "Mot de passe actuel incorrect" });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE accounts SET password_hash = ? WHERE id = ?", [newHash, req.auth.id]);
  res.json({ message: "Mot de passe mis à jour" });
};

module.exports = {
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
};
