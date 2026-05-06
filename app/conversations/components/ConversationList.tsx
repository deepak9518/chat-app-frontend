"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FullConversationType, User } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { useAuth } from "@/app/context/AuthContext";
import { getSocket } from "@/app/lib/socket";

interface ConversationListProps {
  initialConversations: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialConversations,
  users,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(initialConversations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { conversationId, isOpen } = useConversation();

  useEffect(() => {
    if (!user?.userId) return;

    const socket = getSocket();

    socket.emit("join-user", user.userId);

    const newHandler = (conversation: FullConversationType) => {
      setConversations((prev) => {
        if (prev.find((c) => c.id === conversation.id)) return prev;
        return [conversation, ...prev];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversation.id
            ? { ...c, messages: conversation.messages }
            : c,
        ),
      );
    };

    const deleteHandler = (conversationId: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    };

    socket.on("conversation:new", newHandler);
    socket.on("conversation:update", updateHandler);
    socket.on("conversation:delete", deleteHandler);

    return () => {
      socket.off("conversation:new", newHandler);
      socket.off("conversation:update", updateHandler);
      socket.off("conversation:delete", deleteHandler);
    };
  }, [user?.userId]);
  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
          isOpen ? "hidden" : "block w-full left-0",
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 py-4 border-b">
            <div className="text-2xl font-bold text-neutral-800">Chats</div>
            <div
              onClick={() => setIsModalOpen(true)}
              title="Create a group chat"
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {conversations.map((conversation) => (
            <ConversationBox
              key={conversation.id}
              conversation={conversation}
              selected={conversationId === conversation.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};
export default ConversationList;
