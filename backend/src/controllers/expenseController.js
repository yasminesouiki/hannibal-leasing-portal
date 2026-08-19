const pool = require("../data/db");

const MISSION_FIELDS = [
  "dateDebut", "dateFin", "lieuDepart", "destination", "objetMission",
  "moyenTransport", "kmDepart", "kmArrivee",
  "fraisPeage", "fraisParking", "fraisCarburant", "fraisRepas", "fraisHebergement",
];
const DIVERS_FIELDS = ["date", "categorie", "description"];

const buildDetails = (type, body) => {
  const fields = type === "mission" ? MISSION_FIELDS : DIVERS_FIELDS;
  const details = {};
  fields.forEach((field) => {
    if (body[field] !== undefined) details[field] = body[field];
  });
  return details;
};

// ---- AGENT ----

const createExpense = async (req, res) => {
  const { type, montant } = req.body;

  if (!["mission", "divers"].includes(type)) {
    return res.status(400).json({ message: "Type de demande invalide" });
  }
  if (!montant || Number(montant) <= 0) {
    return res.status(400).json({ message: "Montant invalide" });
  }

  const details = buildDetails(type, req.body);
  const justificatif = req.file ? `/uploads/${req.file.filename}` : null;

  const [result] = await pool.query(
    "INSERT INTO expense_requests (user_id, type, montant, details, justificatif) VALUES (?, ?, ?, ?, ?)",
    [req.auth.id, type, montant, JSON.stringify(details), justificatif]
  );

  res.status(201).json({ message: "Demande envoyée à l'administrateur", id: result.insertId });
};

const listMyExpenses = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM expense_requests WHERE user_id = ? ORDER BY created_at DESC",
    [req.auth.id]
  );
  res.json({ expenses: rows });
};

// ---- ADMIN ----

const listExpenses = async (req, res) => {
  const status = ["pending", "accepted", "rejected"].includes(req.query.status)
    ? req.query.status
    : "pending";

  const [rows] = await pool.query(
    `SELECT er.*, a.nom, a.prenom, a.poste
     FROM expense_requests er
     JOIN accounts a ON a.id = er.user_id
     WHERE er.status = ?
     ORDER BY er.created_at DESC`,
    [status]
  );
  res.json({ expenses: rows });
};

const updateExpenseStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  const [rows] = await pool.query("SELECT * FROM expense_requests WHERE id = ?", [id]);
  const expense = rows[0];
  if (!expense) {
    return res.status(404).json({ message: "Demande introuvable" });
  }
  if (expense.status !== "pending") {
    return res.status(400).json({ message: "Cette demande a déjà été traitée" });
  }

  await pool.query(
    "UPDATE expense_requests SET status = ?, decided_at = NOW() WHERE id = ?",
    [status, id]
  );

  if (status === "accepted") {
    await pool.query(
      "UPDATE accounts SET budget_restant = budget_restant - ? WHERE id = ?",
      [expense.montant, expense.user_id]
    );
  }

  res.json({ message: "Statut mis à jour" });
};

// ---- COMMUN ----

const getExpenseById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(
    `SELECT er.*, a.nom, a.prenom, a.poste, a.email
     FROM expense_requests er
     JOIN accounts a ON a.id = er.user_id
     WHERE er.id = ?`,
    [id]
  );
  const expense = rows[0];
  if (!expense) {
    return res.status(404).json({ message: "Demande introuvable" });
  }
  if (req.auth.role !== "admin" && expense.user_id !== req.auth.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  res.json({ expense });
};

module.exports = {
  createExpense,
  listMyExpenses,
  listExpenses,
  updateExpenseStatus,
  getExpenseById,
};
