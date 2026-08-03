import "./AuthLayout.css";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/src/assets/logo-lease.png" alt="Hannibal Lease" />
        </div>

        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}

        <div className="auth-content">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;