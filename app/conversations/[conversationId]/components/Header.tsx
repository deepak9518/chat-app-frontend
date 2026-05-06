"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import { Room, User } from "@/app/types";
import { getSocket } from "@/app/lib/socket";
import { useAuth } from "@/app/context/AuthContext";

interface HeaderProps {
  conversation: Room;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {

  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?._id || "") !== -1;
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { user } = useAuth();
  const statusText = useMemo(() => {
    if (conversation.type === "group") {
      return `${conversation.members.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);
  useEffect(() => {
    if (!user?._id || !conversation._id) return;

    const socket = getSocket(user._id);

    const typingHandler = ({ userId, isTyping }: any) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (prev.includes(userId)) return prev;
          return [...prev, userId];
        } else {
          return prev.filter((id) => id !== userId);
        }
      });
    };

    socket.on("userTyping", typingHandler);

    return () => {
      socket.off("userTyping", typingHandler);
    };
  }, [conversation._id]);
  const invitedUser =  conversation.invitedUsers?.find((_) => _?._id !== user?._id);
  const isTyping =
    typingUsers &&
    (otherUser ||invitedUser) &&
    typingUsers.includes(
      (otherUser || invitedUser)!?._id,
    );

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            className="lg:hidden block text-cyan-500 hover:text-cyan-600 transition cursor-pointer"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>

          {conversation.type === "group" ? (
            <AvatarGroup users={conversation.members} />
          ) : (
            <Avatar user={otherUser!} />
          )}

          <div className="flex flex-col">
            <div>
              {conversation.name || otherUser?.name || otherUser?.email}
            </div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
            <p className="text-xs text-gray-500">
              {isTyping
                ? "Typing..."
                : otherUser?.online
                  ? "Online"
                  : `Last seen ${new Date(otherUser?.lastSeen!).toLocaleTimeString()}`}
            </p>
          </div>
        </div>

        <HiEllipsisHorizontal
          className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition"
          size={32}
          onClick={() => setDrawerOpen(true)}
        />
      </div>
    </>
  );
};
export default Header;
