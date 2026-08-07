import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo-lease.png";
import "./UserLayout.css";

const UserLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "user-nav-link user-nav-link-active" : "user-nav-link";

  return (
    <div className="user-layout">
      <aside className="user-sidebar">
        <div className="user-sidebar-brand">
          <img src={logo} alt="Hannibal Lease" className="user-sidebar-logo" />
          <span>Hannibal Lease</span>
        </div>

        <nav className="user-nav">
          <NavLink to="/user/expenses" className={navLinkClass}>
            Notes de frais
          </NavLink>
          <NavLink to="/user/settings" className={navLinkClass}>
            Mes coordonnées
          </NavLink>
        </nav>

        <button className="user-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </aside>

      <main className="user-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
