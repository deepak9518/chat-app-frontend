import { api } from "@/app/lib/api";
import { Chat } from "@/app/types";

const getMessages = async (conversationId: string): Promise<Chat[]> => {
  try {
    const res = await api.get(`/rooms/${conversationId}/chats`, {
      params: { limit: 50 }
    });
    return res.data.reverse();
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
};

export default getMessages;