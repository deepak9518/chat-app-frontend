import { api } from "../lib/api";

const getMessages = async (conversationId: string) => {
  try {
    const res = await api.get(`/messages/${conversationId}`);
    return res.data;
  } catch {
    return [];
  }
};

export default getMessages;