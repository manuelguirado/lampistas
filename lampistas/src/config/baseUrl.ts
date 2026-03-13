const rawApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").trim();

const withProtocol = /^https?:\/\//i.test(rawApiUrl)
  ? rawApiUrl
  : `https://${rawApiUrl}`;

export const API_BASE_URL = withProtocol.replace(/\/+$/, "");
