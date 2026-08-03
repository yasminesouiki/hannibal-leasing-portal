export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isStrongPassword = (password) => {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

export const isValidSecurityCode = (code) => {
  return /^\d{6}$/.test(code);
};

export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};