"use client";

import { useState, useRef, useEffect } from "react";
import { FullMessageType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { getSocket } from "@/app/lib/socket";
import { useAuth } from "@/app/context/AuthContext";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  const socket = user?._id ? getSocket(user._id) : null;

  useEffect(() => {
    if (!socket || !conversationId) return;

    console.log("🔌 Joining room:", conversationId);

    socket.emit("joinRoom", conversationId);

    return () => {
      socket.off("newMessage");
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const messageHandler = (message: FullMessageType) => {
      console.log("📥 Received message:", message);

      if (message.room_id === conversationId) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });

        socket.emit("markAsRead", conversationId);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    socket.on("newMessage", messageHandler);

    return () => {
      socket.off("newMessage", messageHandler);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("markAsRead", conversationId);
  }, [socket, conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message._id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;