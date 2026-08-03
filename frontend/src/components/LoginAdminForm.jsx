import { useState } from "react";
import { Link } from "react-router-dom";
import { loginAdminStep1 } from "../services/authService";
import { isValidEmail } from "../utils/validators";
import "./AuthForm.css";

const LoginAdminForm = ({ onCodeSent }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!isValidEmail(email)) newErrors.email = "Email invalide";
    if (!password) newErrors.password = "Mot de passe requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await loginAdminStep1(email, password);
      onCodeSent(email);
    } catch (err) {
      setGlobalError(
        err.response?.data?.message || "Email ou mot de passe incorrect",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {globalError && <div className="global-error">{globalError}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="admin-email">
          Email administrateur
        </label>
        <input
          id="admin-email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@hannibal-lease.tn"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="admin-password">
          Mot de passe
        </label>
        <input
          id="admin-password"
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {errors.password && (
          <span className="form-error">{errors.password}</span>
        )}
      </div>

      <button
        type="submit"
        className="form-button btn-admin-login"
        disabled={loading}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <p className="form-footer">
        <Link to="/login" className="form-footer-link">
          Revenir à l'espace utilisateur
        </Link>
      </p>
    </form>
  );
};

export default LoginAdminForm;
