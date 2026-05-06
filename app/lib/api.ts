import axios from "axios";

export const api = axios.create({
  baseURL: "https://chat-app-backend-2vyp.onrender.com/",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
  },
});
