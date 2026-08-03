import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { isValidEmail } from "../utils/validators";
import { useAuth } from "../hooks/useAuth";
import "./AuthForm.css";

const LoginUserForm = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
      const data = await loginUser(email, password);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setGlobalError(
        err.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {globalError && <div className="global-error">{globalError}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {errors.password && (
          <span className="form-error">{errors.password}</span>
        )}
      </div>

      <button type="submit" className="form-button btn-user-login" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <p className="form-footer">
        Pas encore de compte ?{" "}
        <span className="form-footer-link" onClick={onSwitchToSignup}>
          Créer un compte
        </span>
      </p>
    </form>
  );
};

export default LoginUserForm;