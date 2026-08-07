const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const pool = require("./db");

// Crée la base si besoin, la table des comptes, et sème l'admin + le RH de test.
const initDb = async () => {
  const rootConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await rootConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
  );
  await rootConnection.end();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100),
      prenom VARCHAR(100),
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      poste VARCHAR(150),
      photo VARCHAR(255),
      role ENUM('user', 'admin', 'rh') NOT NULL DEFAULT 'user',
      status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'accepted',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ajoute les colonnes si la table existait déjà avant cette évolution
  await addColumnIfMissing("photo", "VARCHAR(255)");
  await addColumnIfMissing("status", "ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'accepted'");

  await seedAccount(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD, "admin");
  await seedAccount(process.env.RH_EMAIL, process.env.RH_PASSWORD, "rh");
};

const addColumnIfMissing = async (column, definition) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM information_schema.columns
     WHERE table_schema = ? AND table_name = 'accounts' AND column_name = ?`,
    [process.env.DB_NAME, column]
  );
  if (rows[0].count > 0) return;

  await pool.query(`ALTER TABLE accounts ADD COLUMN ${column} ${definition}`);
};

const seedAccount = async (email, password, role) => {
  const [rows] = await pool.query("SELECT id FROM accounts WHERE email = ?", [email]);
  if (rows.length > 0) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO accounts (email, password_hash, role) VALUES (?, ?, ?)",
    [email, passwordHash, role]
  );
  console.log(`Compte ${role} initialisé : ${email}`);
};

module.exports = initDb;
