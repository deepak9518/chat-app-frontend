import { api } from "../lib/api";

const getConversations = async () => {
  try {
    const res = await api.get('/conversations');
    return res.data;
  } catch {
    return [];
  }
};

export default getConversations;