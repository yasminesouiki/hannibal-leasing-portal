import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserAuthPage from "../pages/UserAuthPage";
import AdminAuthPage from "../pages/AdminAuthPage";
import RhAuthPage from "../pages/RhAuthPage";
import AdminLayout from "../components/AdminLayout";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminSettingsPage from "../pages/AdminSettingsPage";
import AdminMessageriePage from "../pages/AdminMessageriePage";
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
              <div>Page user </div>
            </ProtectedRoute>
          }
        />

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
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="messagerie" element={<AdminMessageriePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
