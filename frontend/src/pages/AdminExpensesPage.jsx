import { useParams, Navigate, NavLink } from "react-router-dom";
import AdminExpensesList from "../components/AdminExpensesList";
import BudgetBar from "../components/BudgetBar";
import "../components/AuthForm.css";
import "./AdminExpensesPage.css";

const VALID_STATUSES = ["pending", "accepted", "rejected"];
const TABS = [
  { status: "pending", label: "En attente" },
  { status: "accepted", label: "Acceptées" },
  { status: "rejected", label: "Rejetées" },
];

const AdminExpensesPage = () => {
  const { status } = useParams();

  if (!VALID_STATUSES.includes(status)) {
    return <Navigate to="/admin/expenses/pending" replace />;
  }

  return (
    <div className="admin-expenses-page">
      <h2>Notes de frais</h2>

      <BudgetBar editable />

      <div className="admin-expenses-tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.status}
            to={`/admin/expenses/${tab.status}`}
            className={({ isActive }) =>
              isActive ? "admin-expenses-tab admin-expenses-tab-active" : "admin-expenses-tab"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AdminExpensesList status={status} />
    </div>
  );
};

export default AdminExpensesPage;
