import { api } from "../lib/api";

const getUsers = async () => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch {
    return [];
  }
};

export default getUsers;