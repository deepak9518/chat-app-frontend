"use client";

import useConversation from "@/app/hooks/useConversation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { getSocket } from "@/app/lib/socket";
import { api } from "@/app/lib/api";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const Form = () => {
  const { user } = useAuth();
  const { conversationId } = useConversation();

  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { message: "" },
  });

  const message = watch("message");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const text = data.message?.trim();

    if (!text && attachments.length === 0) return;

    const socket = getSocket(user?._id!);

    socket?.emit("sendMessage", {
      room_id: conversationId,
      content: text || "",
      attachments,
    });

    setValue("message", "");
    setAttachments([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await api.post("/files/upload", formData);

      const uploaded = res.data.urls;

      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };
  let typingTimeout: any;

  const handleTyping = () => {
    const socket = getSocket(user!._id);

    socket.emit("typing", {
      roomId: conversationId,
      isTyping: true,
    });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("typing", {
        roomId: conversationId,
        isTyping: false,
      });
    }, 1000);
  };
  return (
    <div className="py-4 px-4 bg-white border-t flex flex-col gap-2 w-full">
      {attachments.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {attachments.map((file, i) => {
            const isImage =
              file.type?.startsWith("image") ||
              file.url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);

            return (
              <div
                key={i}
                className="relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-100"
              >
                {isImage ? (
                  <img
                    src={file.url}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-xs text-gray-600 p-2 text-center">
                    {file.name || "File"}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-2 lg:gap-4 w-full">
        <label className="cursor-pointer">
          <HiPhoto size={30} className="text-cyan-500" />
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          \
          <MessageInput
            {...register("message")}
            onChange={handleTyping}
            id="message"
            register={register}
            errors={errors}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            disabled={isUploading}
            className="rounded-full p-2 bg-cyan-500 cursor-pointer hover:bg-cyan-600 transition disabled:opacity-50"
          >
            <HiPaperAirplane size={20} className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
