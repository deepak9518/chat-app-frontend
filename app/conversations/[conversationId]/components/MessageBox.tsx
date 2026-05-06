'use client';

import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/app/types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useState } from 'react';
import ImageModal from './ImageModal';
import { useAuth } from '@/app/context/AuthContext';

interface MessageBoxProps {
  isLast: boolean;
  data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
  const { user } = useAuth();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const isOwn = user?.email === data.sender_id?.email;

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-cyan-500 text-white' : 'bg-gray-100',
    'rounded-full py-2 px-3'
  );

  const seenList = data.readBy?.filter(id => id !== user?._id).length || 0;
  const seenText = seenList === 0 ? '' : `Seen by ${seenList} other${seenList > 1 ? 's' : ''}`;

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
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          {data.attachments && data.attachments.length > 0 && (
            <div className="space-y-1">
              {data.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 underline text-sm"
                >
                  📎 {att.name}
                </a>
              ))}
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