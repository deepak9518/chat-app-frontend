"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import { Room, Chat } from "@/app/types";
import LoadingModal from "@/app/components/LoadingModal";

const ConversationIdPage = () => {
  const params = useParams();
  const conversationId = params?.conversationId as string;

  const [conversation, setConversation] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [conv, msgs] = await Promise.all([
          getConversationById(conversationId),
          getMessages(conversationId),
        ]);
        setConversation(conv);
        setMessages(msgs);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId]);

  if (loading) {
    return <LoadingModal />;
  }

  if (error || !conversation) {
    return (
      <div className="w-full h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      className="h-full w-full"
    >
      <Header conversation={conversation} />
      <Body initialMessages={messages} />
      <Form />
    </div>
  );
};

export default ConversationIdPage;
