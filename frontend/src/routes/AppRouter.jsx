import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserAuthPage from "../pages/UserAuthPage";
import AdminAuthPage from "../pages/AdminAuthPage";
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

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "rh"]}>
              <div>Page user </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <div>Page admin </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;