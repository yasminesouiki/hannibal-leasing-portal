import { useEffect, useState } from "react";
import { getMyExpenses } from "../services/authService";
import { TYPE_LABELS, STATUS_LABELS } from "../utils/expenseLabels";
import ExpenseDetails from "./ExpenseDetails";
import "./ExpenseList.css";
import "./MyExpensesList.css";

const MyExpensesList = ({ refreshKey }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyExpenses();
      setExpenses(data.expenses);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger vos demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshKey]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="my-expenses-list">
      {error && <div className="global-error">{error}</div>}

      {expenses.length === 0 ? (
        <p>Aucune demande envoyée pour le moment.</p>
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
                  <span className={`expense-type-badge expense-type-${expense.type}`}>
                    {TYPE_LABELS[expense.type]}
                  </span>
                  <span className="expense-card-montant">{Number(expense.montant).toFixed(2)} TND</span>
                  <span className="expense-card-date">
                    {new Date(expense.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  <span className={`expense-status-badge expense-status-${expense.status}`}>
                    {STATUS_LABELS[expense.status]}
                  </span>
                  <span className="expense-card-chevron">{expanded ? "▲" : "▼"}</span>
                </button>

                {expanded && (
                  <div className="expense-card-body">
                    <ExpenseDetails expense={expense} />
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

export default MyExpensesList;
