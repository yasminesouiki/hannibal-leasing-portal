import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./AdminLayout.css";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "admin-nav-link admin-nav-link-active" : "admin-nav-link";

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">Hannibal Lease</div>

        <nav className="admin-nav">
          <NavLink to="/admin/users" className={navLinkClass}>
            Utilisateurs
          </NavLink>
          <NavLink to="/admin/messagerie" className={navLinkClass}>
            Messagerie
          </NavLink>
          <NavLink to="/admin/settings" className={navLinkClass}>
            Paramètres
          </NavLink>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
