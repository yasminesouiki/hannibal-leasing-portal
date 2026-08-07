import { getDetailLabels } from "../utils/expenseLabels";
import { getFileUrl } from "../services/authService";
import "./ExpenseDetails.css";

const ExpenseDetails = ({ expense }) => {
  const labels = getDetailLabels(expense.type);

  return (
    <div className="expense-details">
      <dl className="expense-details-grid">
        {Object.entries(labels).map(([key, label]) => {
          const value = expense.details?.[key];
          if (!value) return null;
          return (
            <div className="expense-details-item" key={key}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          );
        })}
      </dl>

      {expense.justificatif && (
        <a
          className="expense-details-file"
          href={getFileUrl(expense.justificatif)}
          target="_blank"
          rel="noreferrer"
        >
          Voir le justificatif
        </a>
      )}
    </div>
  );
};

export default ExpenseDetails;
