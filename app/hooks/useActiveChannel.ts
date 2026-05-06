import { useEffect } from "react";
import useActiveList from "./useActiveList";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../lib/socket";

const useActiveChannel = () => {
  const { add, remove } = useActiveList();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    const handlePresenceUpdate = ({ userId, online }: { userId: string; online: boolean }) => {
      if (online) {
        add(userId);
      } else {
        remove(userId);
      }
    };

    socket.on("presenceUpdate", handlePresenceUpdate);

    return () => {
      socket.off("presenceUpdate", handlePresenceUpdate);
    };
  }, [user?._id, add, remove]);
};

export default useActiveChannel;