import { api } from "../lib/api";

const getConversationById = async (conversationId: string) => {
  try {
    const res = await api.get(`/conversations/${conversationId}`);
    return res.data;
  } catch {
    return null;
  }
};

export default getConversationById;