import { useMemo } from 'react';
import { Room, User } from '../types';
import { useAuth } from '../context/AuthContext';

const useOtherUser = (room: Room | { users: User[]; members?: User[] }) => {
  const { user } = useAuth();
  const members = 'members' in room ? room.members : room.users;

  const otherUser = useMemo(() => {
    if (!user) return null;
    return members!.find((u: User) => u._id !== user._id);
  }, [user, members]);

  return otherUser;
};

export default useOtherUser;