import { useEffect } from 'react';
import useActiveList from './useActiveList';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../lib/socket';

const useActiveChannel = () => {
  const { set } = useActiveList();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.userId) return;

    const socket = getSocket();

    socket.emit('online', user.userId);

    socket.on('users:active', (users: string[]) => {
      set(users);
    });

    return () => {
      socket.off('users:active');
    };
  }, [user?.userId]);
};

export default useActiveChannel;