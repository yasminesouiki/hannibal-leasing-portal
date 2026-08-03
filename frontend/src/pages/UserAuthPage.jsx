import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import LoginUserForm from "../components/LoginUserForm";
import SignupUserForm from "../components/SignupUserForm";

const UserAuthPage = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  return (
    <AuthLayout
      title={mode === "login" ? "Connexion" : "Créer un compte"}
      subtitle="Portail Hannibal Leasing"
    >
      {mode === "login" ? (
        <LoginUserForm onSwitchToSignup={() => setMode("signup")} />
      ) : (
        <SignupUserForm onSwitchToLogin={() => setMode("login")} />
      )}

      <p className="form-footer admin-link">
        <Link to="/admin/login" className="form-footer-link">
          Espace administrateur
        </Link>
      </p>
    </AuthLayout>
  );
};

export default UserAuthPage;