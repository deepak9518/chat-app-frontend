"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

import { Room, User } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { useAuth } from "@/app/context/AuthContext";
import { getSocket } from "@/app/lib/socket";
import { api } from "@/app/lib/api";
import getRooms from "@/app/actions/getRooms";
import getUsers from "@/app/actions/getUsers";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import Avatar from "@/app/components/Avatar";

interface ConversationListProps {
  initialRooms?: Room[];
  users?: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialRooms = [],
  users = [],
}) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenSettings, setIsOpen] = useState(false);

  const { conversationId, isOpen } = useConversation();
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      const [r, u] = await Promise.all([getRooms(), getUsers()]);
      setRooms(r);
      setAllUsers(u);
    };
    fetch();
  }, []);

  const refreshRooms = async () => {
    const res = await api.get("/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    if (!user?._id) return;
    refreshRooms();
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket(user._id);

    const newMessageHandler = () => refreshRooms();
    const newRoomHandler = (room: Room) => setRooms((prev) => [room, ...prev]);
    const updateRoomHandler = (updatedRoom: Room) =>
      setRooms((prev) =>
        prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r)),
      );

    socket.on("newMessage", newMessageHandler);
    socket.on("room:new", newRoomHandler);
    socket.on("room:update", updateRoomHandler);

    return () => {
      socket.off("newMessage", newMessageHandler);
      socket.off("room:new", newRoomHandler);
      socket.off("room:update", updateRoomHandler);
    };
  }, [user?._id]);

  const logout = async () => {
    await api.post("/auth/logout");
    router.push("/");
  };

  return (
    <>
      <SettingsModal
        currentUser={user!}
        isOpen={isOpenSettings}
        onClose={() => setIsOpen(false)}
      />

      <GroupChatModal
        users={allUsers}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div
        className={clsx(
          "h-full flex flex-col bg-white border-r border-gray-200",
          "block w-full lg:w-80",
        )}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Chats</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <MdOutlineGroupAdd size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {rooms.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              No conversations yet
            </p>
          )}

          {rooms.map((room) => (
            <ConversationBox
              key={room._id}
              conversation={room}
              selected={conversationId === room._id}
            />
          ))}
        </div>

        <div className="px-4 py-3 border-t flex items-center justify-between bg-gray-50">
          <div
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80"
          >
            <Avatar user={user!} />
            <span className="text-sm font-medium text-gray-700">
              {user?.name || "Profile"}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            title="Logout"
          >
            <HiArrowLeftOnRectangle size={22} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ConversationList;
