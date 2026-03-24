// Defines base URL for all API requests.
// In development, "/api" will be caught by Vite’s proxy and forwarded to http://localhost:5000/api
// In production, your backend will serve /api/... directly.
export const BASE_URL = "";

// USERS_URL expands to "/api/users" which matches your backend route prefix in server.js
export const USERS_URL = `${BASE_URL}/api/users`;
export const SESH_URL = `${BASE_URL}/api/seshes`;