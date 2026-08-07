const pool = require("../data/db");

const getBudget = async (req, res) => {
  const [rows] = await pool.query("SELECT montant FROM budget WHERE id = 1");
  res.json({ montant: rows[0]?.montant ?? 0 });
};

const updateBudget = async (req, res) => {
  const { montant } = req.body;
  if (montant === undefined || Number.isNaN(Number(montant))) {
    return res.status(400).json({ message: "Montant invalide" });
  }

  await pool.query("UPDATE budget SET montant = ? WHERE id = 1", [montant]);
  res.json({ montant: Number(montant) });
};

module.exports = { getBudget, updateBudget };
