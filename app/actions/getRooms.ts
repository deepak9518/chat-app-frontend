import { api } from "@/app/lib/api";
import { Room } from "@/app/types";

const getRooms = async (): Promise<Room[]> => {
  try {
    const res = await api.get('/rooms');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return [];
  }
};

export default getRooms;