"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function InvitePage({ params }: any) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(`/?redirect=/invite/${params.roomId}`);
      return;
    }

    const joinRoom = async () => {
      try {
        await api.post(`/rooms/${params.roomId}/join`);
        router.push(`/conversations/${params.roomId}`);
      } catch {
        router.push("/");
      }
    };

    joinRoom();
  }, [user, loading]);

  return (
    <div className="h-screen flex items-center justify-center">
      Joining room...
    </div>
  );
}