import { useEffect, useRef, useState } from "react";
import { getMe, updateProfile, changePassword, getPhotoUrl } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import "../components/AuthForm.css";
import "./AdminSettingsPage.css";

const TABS = [
  { key: "personal", label: "Données personnelles" },
  { key: "security", label: "Sécurité" },
];

const AdminSettingsPage = () => {
  const { token, login } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("personal");

  const [profileForm, setProfileForm] = useState({ nom: "", prenom: "", email: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      const data = await getMe();
      setProfileForm({
        nom: data.user.nom || "",
        prenom: data.user.prenom || "",
        email: data.user.email || "",
      });
      setPhotoPreview(getPhotoUrl(data.user.photo));
    } catch {
      setProfileError("Impossible de charger vos coordonnées");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!profileForm.nom || !profileForm.prenom || !profileForm.email) {
      setProfileError("Tous les champs sont requis");
      return;
    }

    setProfileSaving(true);
    try {
      const data = await updateProfile({ ...profileForm, photoFile });
      login(data.user, token);
      setPhotoFile(null);
      setProfileSuccess("Coordonnées mises à jour");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Mise à jour impossible");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tous les champs sont requis");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess("Mot de passe mis à jour");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Mise à jour impossible");
    } finally {
      setPasswordSaving(false);
    }
  };

  const initials = `${profileForm.prenom?.[0] || ""}${profileForm.nom?.[0] || ""}`.toUpperCase();

  if (profileLoading) return <p>Chargement...</p>;

  return (
    <div className="admin-settings-page">
      <h2>Paramètres</h2>

      <div className="admin-settings-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={
              activeTab === tab.key
                ? "admin-settings-tab admin-settings-tab-active"
                : "admin-settings-tab"
            }
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "personal" && (
        <section className="admin-settings-card">
          <form onSubmit={handleProfileSubmit} noValidate className="admin-settings-personal">
            <div className="admin-settings-avatar-block">
              <div className="admin-settings-avatar">
                {photoPreview ? (
                  <img src={photoPreview} alt="Photo de profil" />
                ) : (
                  <span>{initials || "?"}</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                hidden
              />
              <button
                type="button"
                className="admin-settings-photo-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Changer la photo
              </button>
            </div>

            <div className="admin-settings-fields">
              {profileError && <div className="global-error">{profileError}</div>}
              {profileSuccess && <div className="global-success">{profileSuccess}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="nom">Nom</label>
                <input
                  id="nom"
                  name="nom"
                  className="form-input"
                  value={profileForm.nom}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prenom">Prénom</label>
                <input
                  id="prenom"
                  name="prenom"
                  className="form-input"
                  value={profileForm.prenom}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                />
              </div>

              <button type="submit" className="form-button" disabled={profileSaving}>
                {profileSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </section>
      )}

      {activeTab === "security" && (
        <section className="admin-settings-card">
          <form onSubmit={handlePasswordSubmit} noValidate className="admin-settings-security">
            {passwordError && <div className="global-error">{passwordError}</div>}
            {passwordSuccess && <div className="global-success">{passwordSuccess}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                className="form-input"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="form-input"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <button type="submit" className="form-button" disabled={passwordSaving}>
              {passwordSaving ? "Enregistrement..." : "Changer le mot de passe"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default AdminSettingsPage;
