// Les comptes sont persistés en MySQL (voir db.js / initDb.js).
// Les codes de vérification sont éphémères (5 min) : pas besoin de les stocker en base.
// clé: "admin:email" -> { code, expiresAt }
const verificationCodes = new Map();

module.exports = { verificationCodes };
