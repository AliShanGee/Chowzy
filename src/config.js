// src/config.js
// For Railway deployment, set REACT_APP_API_URL to your backend URL (e.g. https://your-app.up.railway.app)
// and keep this line as fallback for local development.
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export default API_BASE_URL;
