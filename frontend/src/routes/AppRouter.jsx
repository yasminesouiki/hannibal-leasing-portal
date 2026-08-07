import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserAuthPage from "../pages/UserAuthPage";
import AdminAuthPage from "../pages/AdminAuthPage";
import RhAuthPage from "../pages/RhAuthPage";
import AdminLayout from "../components/AdminLayout";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminExpensesPage from "../pages/AdminExpensesPage";
import AdminMessageriePage from "../pages/AdminMessageriePage";
import UserLayout from "../components/UserLayout";
import UserExpensesPage from "../pages/UserExpensesPage";
import SettingsPage from "../pages/SettingsPage";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Redirige selon le rôle : les agents (user) vont vers leurs notes de frais,
// les RH n'ont pas encore d'espace dédié.
const DashboardRedirect = () => {
  const { role } = useAuth();

  if (role === "user") return <Navigate to="/user/expenses" replace />;
  return <div>Page RH </div>;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<UserAuthPage />} />
        <Route path="/admin/login" element={<AdminAuthPage />} />
        <Route path="/rh/login" element={<RhAuthPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "rh"]}>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/user/expenses" replace />} />
          <Route path="expenses" element={<UserExpensesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Navigate to="/admin/users/pending" replace />} />
          <Route path="users" element={<Navigate to="/admin/users/pending" replace />} />
          <Route path="users/:status" element={<AdminUsersPage />} />
          <Route path="expenses" element={<Navigate to="/admin/expenses/pending" replace />} />
          <Route path="expenses/:status" element={<AdminExpensesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="messagerie" element={<AdminMessageriePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
