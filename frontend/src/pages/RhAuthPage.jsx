import AuthLayout from "../components/AuthLayout";
import LoginRhForm from "../components/LoginRhForm";

const RhAuthPage = () => {
  return (
    <AuthLayout title="Espace Ressources Humaines" subtitle="Portail Hannibal Leasing">
      <LoginRhForm />
    </AuthLayout>
  );
};

export default RhAuthPage;
