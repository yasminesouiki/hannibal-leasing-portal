import { useEffect, useState } from "react";
import { getUsersByStatus, updateUserStatus } from "../services/authService";
import "./AdminUsersList.css";

const EMPTY_LABEL = {
  pending: "Aucune demande en attente.",
  accepted: "Aucun utilisateur accepté.",
  rejected: "Aucun utilisateur rejeté.",
};

// Liste des comptes utilisateurs pour un statut donné (pending / accepted / rejected)
const AdminUsersList = ({ status }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsersByStatus(status);
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [status]);

  const handleDecision = async (id, newStatus) => {
    setActioningId(id);
    setError("");
    try {
      await updateUserStatus(id, newStatus);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Action impossible pour le moment");
    } finally {
      setActioningId(null);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="admin-users-list">
      {error && <div className="global-error">{error}</div>}

      {users.length === 0 ? (
        <p>{EMPTY_LABEL[status]}</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-card">
              <div className="user-card-info">
                <strong>{user.nom} {user.prenom}</strong>
                <span>{user.email}</span>
                <span>{user.poste}</span>
              </div>

              {status === "pending" && (
                <div className="user-card-actions">
                  <button
                    className="form-button"
                    disabled={actioningId === user.id}
                    onClick={() => handleDecision(user.id, "accepted")}
                  >
                    Accepter
                  </button>
                  <button
                    className="form-button form-button-reject"
                    disabled={actioningId === user.id}
                    onClick={() => handleDecision(user.id, "rejected")}
                  >
                    Rejeter
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUsersList;
