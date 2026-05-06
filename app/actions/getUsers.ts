import { api } from "@/app/lib/api";
import { User } from "@/app/types";

const getUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get('/users/list');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};

export default getUsers;