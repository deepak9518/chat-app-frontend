import { api } from "@/app/lib/api";
import { Room } from "@/app/types";

const getConversationById = async (conversationId: string): Promise<Room | null> => {
  try {
    const res = await api.get(`/rooms/${conversationId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
    return null;
  }
};

export default getConversationById;