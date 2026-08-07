import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// ---- USER ----

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // { token, user }
};

export const signupUser = async ({ nom, prenom, email, password, poste }) => {
  const response = await axios.post(`${API_URL}/signup`, {
    nom,
    prenom,
    email,
    password,
    poste,
  });
  return response.data;
};

// ---- ADMIN (2 étapes) ----

export const loginAdminStep1 = async (email, password) => {
  const response = await axios.post(`${API_URL}/admin/login`, {
    email,
    password,
  });
  return response.data; // { message: "code envoyé" }
};

export const verifyAdminCode = async (email, code) => {
  const response = await axios.post(`${API_URL}/admin/verify`, {
    email,
    code,
  });
  return response.data; // { token, admin }
};

export const resendAdminCode = async (email) => {
  const response = await axios.post(`${API_URL}/admin/resend-code`, {
    email,
  });
  return response.data;
};

// ---- RESSOURCES HUMAINES (connexion directe) ----

export const loginRh = async (email, password) => {
  const response = await axios.post(`${API_URL}/rh/login`, {
    email,
    password,
  });
  return response.data; // { token, rh }
};

// ---- PROFIL (compte connecté, tous rôles) ----

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getMe = async () => {
  const response = await axios.get(`${API_URL}/me`, authHeader());
  return response.data; // { user }
};

export const updateProfile = async ({ nom, prenom, email }) => {
  const response = await axios.put(
    `${API_URL}/profile`,
    { nom, prenom, email },
    authHeader()
  );
  return response.data; // { user }
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await axios.post(
    `${API_URL}/change-password`,
    { currentPassword, newPassword },
    authHeader()
  );
  return response.data;
};

// ---- GESTION DES COMPTES UTILISATEURS (admin) ----

export const getUsersByStatus = async (status) => {
  const response = await axios.get(`${API_URL}/admin/users`, {
    ...authHeader(),
    params: { status },
  });
  return response.data; // { users }
};

export const updateUserStatus = async (id, status) => {
  const response = await axios.patch(
    `${API_URL}/admin/users/${id}/status`,
    { status },
    authHeader()
  );
  return response.data;
};