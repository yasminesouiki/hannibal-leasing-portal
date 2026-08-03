import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import LoginAdminForm from "../components/LoginAdminForm";
import AdminSecurityCodeForm from "../components/AdminSecurityCodeForm";

const AdminAuthPage = () => {
  const [step, setStep] = useState("credentials"); // "credentials" | "code"
  const [email, setEmail] = useState("");

  const handleCodeSent = (submittedEmail) => {
    setEmail(submittedEmail);
    setStep("code");
  };

  return (
    <AuthLayout
      title="Espace Administrateur"
      subtitle={
        step === "credentials"
          ? "Portail Hannibal Leasing"
          : "Vérification en 2 étapes"
      }
    >
      {step === "credentials" ? (
        <LoginAdminForm onCodeSent={handleCodeSent} />
      ) : (
        <AdminSecurityCodeForm
          email={email}
          onBack={() => setStep("credentials")}
        />
      )}
    </AuthLayout>
  );
};

export default AdminAuthPage;
