import { useState } from "react";
import { createExpense } from "../services/authService";
import { CATEGORIE_DIVERS_OPTIONS } from "../utils/expenseLabels";
import "./AuthForm.css";
import "./ExpenseForm.css";

const INITIAL_FORM = {
  date: "",
  categorie: CATEGORIE_DIVERS_OPTIONS[0],
  montant: "",
  description: "",
};

const DiversForm = ({ onSubmitted }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [justificatif, setJustificatif] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.date || !form.montant || Number(form.montant) <= 0) {
      setError("Merci de remplir les champs obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("type", "divers");
    formData.append("montant", form.montant);
    formData.append("date", form.date);
    formData.append("categorie", form.categorie);
    formData.append("description", form.description);
    if (justificatif) {
      formData.append("justificatif", justificatif);
    }

    setSaving(true);
    try {
      await createExpense(formData);
      setForm(INITIAL_FORM);
      setJustificatif(null);
      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || "Envoi impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="expense-form">
      {error && <div className="global-error">{error}</div>}

      <div className="expense-form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            className="form-input"
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="categorie">Catégorie</label>
          <select
            id="categorie"
            name="categorie"
            className="form-input"
            value={form.categorie}
            onChange={handleChange}
          >
            {CATEGORIE_DIVERS_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="montant">Montant (TND)</label>
        <input
          id="montant"
          name="montant"
          type="number"
          step="0.01"
          className="form-input"
          value={form.montant}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">Description courte</label>
        <input
          id="description"
          name="description"
          className="form-input"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="justificatif-divers">Justificatif</label>
        <input
          id="justificatif-divers"
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setJustificatif(e.target.files?.[0] || null)}
        />
      </div>

      <button type="submit" className="form-button" disabled={saving}>
        {saving ? "Envoi..." : "Envoyer la demande"}
      </button>
    </form>
  );
};

export default DiversForm;
