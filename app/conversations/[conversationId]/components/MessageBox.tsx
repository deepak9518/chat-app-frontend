"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";

interface MessageBoxProps {
  isLast: boolean;
  data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
  const { user } = useAuth();
  const isOwn = user?.email === data.sender_id?.email;

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-cyan-500 text-white" : "bg-gray-100",
    "py-2 px-3",
  );

  const seenList = data.readBy?.filter((id) => id !== user?._id).length || 0;
  const seenText =
    seenList === 0 ? "" : `Seen by ${seenList} other${seenList > 1 ? "s" : ""}`;

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender_id} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.sender_id?.name || data.sender_id?.email}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={message}>
          {data.attachments && data.attachments.length > 0 && (
            <div className="space-y-2">
              {data.attachments.map((att: any, idx) => {
                const isImage = (att as any)?.match(
                  /\.(jpeg|jpg|gif|png|webp)$/i,
                );
                if (isImage) {
                  return (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={att}
                        alt={att || "image"}
                        className="
                min-w-[100px]
                min-h-[100px]
                max-w-[250px]
                max-h-[300px]
                object-cover
                cursor-pointer
              "
                      />
                    </a>
                  );
                }

                return (
                  <a
                    key={idx}
                    href={att}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
            flex items-center gap-2
            bg-white/10
            px-3 py-2
            rounded-xl
            text-sm
            underline
          "
                  >
                    📎 {"Attachment"}
                  </a>
                );
              })}
            </div>
          )}
          {data.content && <div>{data.content}</div>}
        </div>
        {isLast && isOwn && seenText && (
          <div className="text-xs font-light text-gray-500">{seenText}</div>
        )}
      </div>
    </div>
  );
};
export default MessageBox;
