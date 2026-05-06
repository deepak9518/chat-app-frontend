import axios from "axios";

export const api = axios.create({
  baseURL: "https://chat-app-backend-omega-beryl-25.vercel.app",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
  },
});
