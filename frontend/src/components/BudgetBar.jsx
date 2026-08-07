import { useEffect, useState } from "react";
import { getBudget, updateBudget } from "../services/authService";
import "./BudgetBar.css";

// Barre de budget global des notes de frais. Le crayon d'édition n'est
// affiché que côté admin (prop `editable`).
const BudgetBar = ({ editable = false }) => {
  const [montant, setMontant] = useState(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadBudget = async () => {
    try {
      const data = await getBudget();
      setMontant(Number(data.montant));
    } catch {
      setError("Impossible de charger le budget");
    }
  };

  useEffect(() => {
    loadBudget();
  }, []);

  const startEdit = () => {
    setValue(montant);
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (value === "" || Number.isNaN(Number(value))) {
      setError("Montant invalide");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const data = await updateBudget(Number(value));
      setMontant(Number(data.montant));
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Mise à jour impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="budget-bar">
      <span className="budget-bar-label">Budget disponible</span>

      {editing ? (
        <div className="budget-bar-edit">
          <input
            type="number"
            step="0.01"
            className="budget-bar-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <span className="budget-bar-currency">TND</span>
          <button type="button" className="budget-bar-save" onClick={handleSave} disabled={saving}>
            Enregistrer
          </button>
          <button type="button" className="budget-bar-cancel" onClick={cancelEdit}>
            Annuler
          </button>
        </div>
      ) : (
        <div className="budget-bar-value">
          {montant === null
            ? "…"
            : `${montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} TND`}
          {editable && (
            <button
              type="button"
              className="budget-bar-pencil"
              onClick={startEdit}
              aria-label="Modifier le budget"
              title="Modifier le budget"
            >
              ✎
            </button>
          )}
        </div>
      )}

      {error && <span className="budget-bar-error">{error}</span>}
    </div>
  );
};

export default BudgetBar;
