"use client";

import { useState, useRef, useEffect } from "react";
import { FullMessageType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { api } from "@/app/lib/api";
import { getSocket } from "@/app/lib/socket";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    api.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    const socket = getSocket();

    if (!conversationId) return;

    // join room
    socket.emit("join", conversationId);

    // mark seen
    api.post(`/conversations/${conversationId}/seen`);

    const messageHandler = (message: FullMessageType) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      api.post(`/conversations/${conversationId}/seen`);
      bottomRef?.current?.scrollIntoView();
    };

    const updateHandler = (updatedMessage: FullMessageType) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m)),
      );
    };

    socket.on("message:new", messageHandler);
    socket.on("message:update", updateHandler);

    return () => {
      socket.emit("leave", conversationId);
      socket.off("message:new", messageHandler);
      socket.off("message:update", updateHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}

      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};
export default Body;
