// Central API base URL. In production (Vercel) we hit the live Render backend;
// locally we hit the Spring Boot dev server. A request interceptor in index.js
// also rewrites any legacy hardcoded localhost:8080 URLs, so old and new code
// both work, but all NEW code should import API_BASE from here.
const isProduction =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (isProduction
    ? 'https://protien-managment-system.onrender.com'
    : 'http://localhost:8080');

export default API_BASE;
