require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const initDb = require("./src/data/initDb");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Échec de l'initialisation de la base de données :", err.message);
    process.exit(1);
  });
