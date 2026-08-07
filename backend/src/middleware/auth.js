const jwt = require("jsonwebtoken");

// Lit le token dans le header "Authorization: Bearer <token>"
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = header.split(" ")[1];
  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// À utiliser après requireAuth : bloque l'accès si le rôle ne correspond pas
const requireRole = (role) => (req, res, next) => {
  if (req.auth.role !== role) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};

module.exports = { requireAuth, requireRole };
