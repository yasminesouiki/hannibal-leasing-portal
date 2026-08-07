const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes

module.exports = { generateCode, CODE_TTL_MS };
