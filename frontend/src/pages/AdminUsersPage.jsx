import { useParams, Navigate, NavLink } from "react-router-dom";
import AdminUsersList from "../components/AdminUsersList";
import "../components/AuthForm.css";
import "./AdminUsersPage.css";

const VALID_STATUSES = ["pending", "accepted", "rejected"];
const TABS = [
  { status: "accepted", label: "Acceptés" },
  { status: "pending", label: "En attente" },
  { status: "rejected", label: "Rejetés" },
];

const AdminUsersPage = () => {
  const { status } = useParams();

  if (!VALID_STATUSES.includes(status)) {
    return <Navigate to="/admin/users/pending" replace />;
  }

  return (
    <div className="admin-users-page">
      <h2>Utilisateurs</h2>

      <div className="admin-users-tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.status}
            to={`/admin/users/${tab.status}`}
            className={({ isActive }) =>
              isActive ? "admin-users-tab admin-users-tab-active" : "admin-users-tab"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AdminUsersList status={status} />
    </div>
  );
};

export default AdminUsersPage;
