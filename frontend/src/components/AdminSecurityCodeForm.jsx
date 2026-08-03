import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAdminCode, resendAdminCode } from "../services/authService";
import { isValidSecurityCode } from "../utils/validators";
import { useAuth } from "../hooks/useAuth";
import "./AuthForm.css";

// Étape 2 : saisie du code reçu par email
const AdminSecurityCodeForm = ({ email, onBack }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidSecurityCode(code)) {
      setError("Le code doit contenir 6 chiffres");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyAdminCode(email, code);
      login(data.admin, data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Code incorrect ou expiré");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendAdminCode(email);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      setError("Impossible de renvoyer le code pour le moment");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="form-footer">
        Un code de sécurité a été envoyé à <strong>{email}</strong>
      </p>

      {error && <div className="global-error">{error}</div>}
      {resent && (
        <div
          className="global-error"
          style={{ background: "#e8f5e9", color: "#2e7d32", borderColor: "#c8e6c9" }}
        >
          Code renvoyé avec succès
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="code">Code de sécurité</label>
        <input
          id="code"
          className="form-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          maxLength={6}
        />
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Vérification..." : "Valider le code"}
      </button>

      <p className="form-footer">
        <span className="form-footer-link" onClick={handleResend}>
          Renvoyer le code
        </span>
        {"  ·  "}
        <span className="form-footer-link" onClick={onBack}>
          Retour
        </span>
      </p>
    </form>
  );
};

export default AdminSecurityCodeForm;