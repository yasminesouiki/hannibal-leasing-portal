import { useState } from "react";
import { createExpense } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { OBJET_MISSION_OPTIONS, MOYEN_TRANSPORT_OPTIONS } from "../utils/expenseLabels";
import "./AuthForm.css";
import "./ExpenseForm.css";

const FRAIS_FIELDS = [
  { key: "fraisPeage", label: "Péage" },
  { key: "fraisParking", label: "Parking" },
  { key: "fraisCarburant", label: "Carburant" },
  { key: "fraisRepas", label: "Repas" },
  { key: "fraisHebergement", label: "Hébergement" },
];

const INITIAL_FORM = {
  dateDebut: "",
  dateFin: "",
  lieuDepart: "",
  destination: "",
  objetMission: OBJET_MISSION_OPTIONS[0],
  moyenTransport: MOYEN_TRANSPORT_OPTIONS[0],
  kmDepart: "",
  kmArrivee: "",
  fraisPeage: "",
  fraisParking: "",
  fraisCarburant: "",
  fraisRepas: "",
  fraisHebergement: "",
};

const MissionForm = ({ onSubmitted }) => {
  const { user } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [justificatif, setJustificatif] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = FRAIS_FIELDS.reduce(
    (sum, field) => sum + (Number(form[field.key]) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.dateDebut || !form.lieuDepart || !form.destination || !form.kmDepart || !form.kmArrivee) {
      setError("Merci de remplir les champs obligatoires");
      return;
    }
    if (total <= 0) {
      setError("Le total des frais prévisionnels doit être supérieur à 0");
      return;
    }

    const formData = new FormData();
    formData.append("type", "mission");
    formData.append("montant", total);
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
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

      <div className="form-group">
        <label className="form-label">Agent</label>
        <input
          className="form-input"
          value={`${user?.prenom || ""} ${user?.nom || ""}`.trim() || user?.email}
          disabled
        />
      </div>

      <div className="expense-form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="dateDebut">Date de début</label>
          <input
            id="dateDebut"
            name="dateDebut"
            type="date"
            className="form-input"
            value={form.dateDebut}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="dateFin">Date de fin (si plusieurs jours)</label>
          <input
            id="dateFin"
            name="dateFin"
            type="date"
            className="form-input"
            value={form.dateFin}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="expense-form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="lieuDepart">Lieu de départ</label>
          <input
            id="lieuDepart"
            name="lieuDepart"
            className="form-input"
            value={form.lieuDepart}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="destination">Destination</label>
          <input
            id="destination"
            name="destination"
            className="form-input"
            value={form.destination}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="expense-form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="objetMission">Objet de la mission</label>
          <select
            id="objetMission"
            name="objetMission"
            className="form-input"
            value={form.objetMission}
            onChange={handleChange}
          >
            {OBJET_MISSION_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="moyenTransport">Moyen de transport</label>
          <select
            id="moyenTransport"
            name="moyenTransport"
            className="form-input"
            value={form.moyenTransport}
            onChange={handleChange}
          >
            {MOYEN_TRANSPORT_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="expense-form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="kmDepart">Km départ</label>
          <input
            id="kmDepart"
            name="kmDepart"
            type="number"
            className="form-input"
            value={form.kmDepart}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="kmArrivee">Km arrivée</label>
          <input
            id="kmArrivee"
            name="kmArrivee"
            type="number"
            className="form-input"
            value={form.kmArrivee}
            onChange={handleChange}
          />
        </div>
      </div>

      <p className="expense-form-subtitle">Frais prévisionnels</p>
      <div className="expense-form-frais-grid">
        {FRAIS_FIELDS.map((field) => (
          <div className="form-group" key={field.key}>
            <label className="form-label" htmlFor={field.key}>{field.label}</label>
            <input
              id={field.key}
              name={field.key}
              type="number"
              step="0.01"
              className="form-input"
              value={form[field.key]}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        ))}
      </div>

      <p className="expense-form-total">Total prévisionnel : {total.toFixed(2)} TND</p>

      <div className="form-group">
        <label className="form-label" htmlFor="justificatif">Justificatifs (tickets, factures)</label>
        <input
          id="justificatif"
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

export default MissionForm;
