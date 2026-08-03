import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// ---- USER ----

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // { token, user }
};

export const signupUser = async ({ nom, prenom, email, password }) => {
  const response = await axios.post(`${API_URL}/signup`, {
    nom,
    prenom,
    email,
    password,
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