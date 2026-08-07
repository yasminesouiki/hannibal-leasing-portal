import { useEffect, useState } from "react";
import { getExpensesByStatus, updateExpenseStatus } from "../services/authService";
import { TYPE_LABELS } from "../utils/expenseLabels";
import ExpenseDetails from "./ExpenseDetails";
import "./ExpenseList.css";

const EMPTY_LABEL = {
  pending: "Aucune demande en attente.",
  accepted: "Aucune demande acceptée.",
  rejected: "Aucune demande rejetée.",
};

const AdminExpensesList = ({ status }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getExpensesByStatus(status);
      setExpenses(data.expenses);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger les demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [status]);

  const handleDecision = async (id, newStatus) => {
    setActioningId(id);
    setError("");
    try {
      await updateExpenseStatus(id, newStatus);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Action impossible pour le moment");
    } finally {
      setActioningId(null);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="admin-expenses-list">
      {error && <div className="global-error">{error}</div>}

      {expenses.length === 0 ? (
        <p>{EMPTY_LABEL[status]}</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => {
            const expanded = expandedId === expense.id;
            return (
              <li key={expense.id} className="expense-card">
                <button
                  type="button"
                  className="expense-card-summary"
                  onClick={() => setExpandedId(expanded ? null : expense.id)}
                >
                  <div className="expense-card-agent">
                    <strong>{expense.nom} {expense.prenom}</strong>
                    <span>{expense.poste}</span>
                  </div>
                  <span className={`expense-type-badge expense-type-${expense.type}`}>
                    {TYPE_LABELS[expense.type]}
                  </span>
                  <span className="expense-card-montant">{Number(expense.montant).toFixed(2)} TND</span>
                  <span className="expense-card-date">
                    {new Date(expense.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="expense-card-chevron">{expanded ? "▲" : "▼"}</span>
                </button>

                {expanded && (
                  <div className="expense-card-body">
                    <ExpenseDetails expense={expense} />

                    {status === "pending" && (
                      <div className="expense-card-actions">
                        <button
                          type="button"
                          className="form-button"
                          disabled={actioningId === expense.id}
                          onClick={() => handleDecision(expense.id, "accepted")}
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          className="form-button form-button-reject"
                          disabled={actioningId === expense.id}
                          onClick={() => handleDecision(expense.id, "rejected")}
                        >
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminExpensesList;
