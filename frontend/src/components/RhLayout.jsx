import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo-lease.png";
import "./RhLayout.css";

const RhLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/rh/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "rh-nav-link rh-nav-link-active" : "rh-nav-link";

  return (
    <div className="rh-layout">
      <aside className="rh-sidebar">
        <div className="rh-sidebar-brand">
          <img src={logo} alt="Hannibal Lease" className="rh-sidebar-logo" />
          <span>Hannibal Lease</span>
        </div>

        <nav className="rh-nav">
          <NavLink to="/rh/expenses" className={navLinkClass}>
            Notes de frais
          </NavLink>
          <NavLink to="/rh/messagerie" className={navLinkClass}>
            Messagerie
          </NavLink>
          <NavLink to="/rh/settings" className={navLinkClass}>
            Mes coordonnées
          </NavLink>
        </nav>

        <button className="rh-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </aside>

      <main className="rh-content">
        <Outlet />
      </main>
    </div>
  );
};

export default RhLayout;
