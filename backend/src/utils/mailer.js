const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationCode = async (to, code) => {
  try {
    await transporter.sendMail({
      from: `"Hannibal Leasing" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Code de vérification - Hannibal Leasing",
      text: `Votre code de vérification est : ${code}\nIl expire dans 5 minutes.`,
    });
    console.log(`Code envoyé par email à ${to}`);
  } catch (err) {
    console.error("Échec de l'envoi de l'email :", err.message);
    console.log(`[SECOURS] Code de vérification pour ${to} : ${code}`);
  }
};

module.exports = { sendVerificationCode };
