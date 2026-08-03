import { useState } from "react";
import { signupUser } from "../services/authService";
import {
  isValidEmail,
  isStrongPassword,
  passwordsMatch,
} from "../utils/validators";
import "./AuthForm.css";

const SignupUserForm = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nom) newErrors.nom = "Nom requis";
    if (!form.prenom) newErrors.prenom = "Prénom requis";
    if (!isValidEmail(form.email)) newErrors.email = "Email invalide";
    if (!isStrongPassword(form.password))
      newErrors.password =
        "8 caractères min., une majuscule et un chiffre";
    if (!passwordsMatch(form.password, form.confirmPassword))
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSuccessMessage("");
    if (!validate()) return;

    setLoading(true);
    try {
      await signupUser(form);
      setSuccessMessage("Compte créé avec succès. Vous pouvez vous connecter.");
      setTimeout(() => onSwitchToLogin(), 1500);
    } catch (err) {
      setGlobalError(
        err.response?.data?.message || "Erreur lors de la création du compte"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {globalError && <div className="global-error">{globalError}</div>}
      {successMessage && (
        <div
          className="global-error"
          style={{ background: "#e8f5e9", color: "#2e7d32", borderColor: "#c8e6c9" }}
        >
          {successMessage}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="prenom">Prénom</label>
        <input
          id="prenom"
          className="form-input"
          value={form.prenom}
          onChange={handleChange("prenom")}
        />
        {errors.prenom && <span className="form-error">{errors.prenom}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="nom">Nom</label>
        <input
          id="nom"
          className="form-input"
          value={form.nom}
          onChange={handleChange("nom")}
        />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="form-input"
          value={form.email}
          onChange={handleChange("email")}
          placeholder="votre.email@hannibal-lease.tn"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          className="form-input"
          value={form.password}
          onChange={handleChange("password")}
        />
        {errors.password && (
          <span className="form-error">{errors.password}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="confirmPassword">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="form-input"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span className="form-error">{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Création..." : "Créer mon compte"}
      </button>

      <p className="form-footer">
        Déjà un compte ?{" "}
        <span className="form-footer-link" onClick={onSwitchToLogin}>
          Se connecter
        </span>
      </p>
    </form>
  );
};

export default SignupUserForm;