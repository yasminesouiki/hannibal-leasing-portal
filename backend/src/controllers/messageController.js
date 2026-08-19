const pool = require("../data/db");

// Admin et RH peuvent écrire à n'importe quel compte actif de la base
const listContacts = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, nom, prenom, email, role, poste FROM accounts WHERE id != ? AND status = 'accepted' ORDER BY role, nom",
    [req.auth.id]
  );
  res.json({ contacts: rows });
};

const listInbox = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT m.*, a.nom AS sender_nom, a.prenom AS sender_prenom, a.email AS sender_email
     FROM messages m
     JOIN accounts a ON a.id = m.sender_id
     WHERE m.recipient_id = ?
     ORDER BY m.created_at DESC`,
    [req.auth.id]
  );
  res.json({ messages: rows });
};

const listSent = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT m.*, a.nom AS recipient_nom, a.prenom AS recipient_prenom, a.email AS recipient_email
     FROM messages m
     JOIN accounts a ON a.id = m.recipient_id
     WHERE m.sender_id = ?
     ORDER BY m.created_at DESC`,
    [req.auth.id]
  );
  res.json({ messages: rows });
};

const sendMessage = async (req, res) => {
  const { recipientId, subject, body } = req.body;

  if (!recipientId || !subject || !body) {
    return res.status(400).json({ message: "Destinataire, objet et message sont requis" });
  }

  if (Number(recipientId) === req.auth.id) {
    return res.status(400).json({ message: "Vous ne pouvez pas vous envoyer un message" });
  }

  const [recipientRows] = await pool.query(
    "SELECT id FROM accounts WHERE id = ? AND status = 'accepted'",
    [recipientId]
  );
  if (recipientRows.length === 0) {
    return res.status(400).json({ message: "Destinataire invalide" });
  }

  const attachment = req.file ? `/uploads/${req.file.filename}` : null;

  const [result] = await pool.query(
    "INSERT INTO messages (sender_id, recipient_id, subject, body, attachment) VALUES (?, ?, ?, ?, ?)",
    [req.auth.id, recipientId, subject, body, attachment]
  );

  res.status(201).json({ message: "Message envoyé", id: result.insertId });
};

const markRead = async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query(
    "UPDATE messages SET is_read = 1 WHERE id = ? AND recipient_id = ?",
    [id, req.auth.id]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Message introuvable" });
  }
  res.json({ message: "Message marqué comme lu" });
};

module.exports = { listContacts, listInbox, listSent, sendMessage, markRead };
