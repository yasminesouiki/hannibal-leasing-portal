const pool = require("../data/db");

// Montant de référence fixé par l'admin, identique pour tous les agents
const getBudget = async (req, res) => {
  const [rows] = await pool.query("SELECT montant FROM budget WHERE id = 1");
  res.json({ montant: rows[0]?.montant ?? 0 });
};

// Change le montant de référence et réinitialise le budget individuel de
// chaque agent accepté sur ce même montant
const updateBudget = async (req, res) => {
  const { montant } = req.body;
  if (montant === undefined || Number.isNaN(Number(montant))) {
    return res.status(400).json({ message: "Montant invalide" });
  }

  await pool.query("UPDATE budget SET montant = ? WHERE id = 1", [montant]);
  await pool.query(
    "UPDATE accounts SET budget_restant = ? WHERE role = 'user' AND status = 'accepted'",
    [montant]
  );
  res.json({ montant: Number(montant) });
};

// Budget individuel restant de l'agent connecté
const getMyBudget = async (req, res) => {
  const [rows] = await pool.query("SELECT budget_restant FROM accounts WHERE id = ?", [req.auth.id]);
  res.json({ montant: rows[0]?.budget_restant ?? 0 });
};

module.exports = { getBudget, updateBudget, getMyBudget };
