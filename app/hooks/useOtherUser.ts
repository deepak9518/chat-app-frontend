import { useMemo } from 'react';
import { FullConversationType, User } from '../types';
import { useAuth } from '../context/AuthContext';

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const { user } = useAuth();

  const otherUser = useMemo(() => {
    if (!user) return null;

    return conversation.users.find((u) => u.id !== user.userId);
  }, [user, conversation.users]);

  return otherUser;
};

export default useOtherUser;