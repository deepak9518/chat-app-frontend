'use client';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Room } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import { useAuth } from '@/app/context/AuthContext';

interface ConversationBoxProps {
  conversation: Room;
  selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  conversation,
  selected,
}) => {
  const otherUser = useOtherUser(conversation);
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation._id}`);
  }, [conversation._id, router]);

  const lastMessage = conversation.lastMessage;
  const unreadCount = conversation.unreadCount || 0;

  const lastMessageText = useMemo(() => {
    if (!lastMessage) return 'No messages yet';
    return lastMessage.content || 'Media message';
  }, [lastMessage]);


  return (
    <div
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-neutral-100',
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {conversation.type === 'group' ? (
        <AvatarGroup users={conversation.members} />
      ) : (
        <Avatar user={otherUser!} />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">
            {conversation.name || otherUser?.name}
          </p>
          {lastMessage?.createdAt && (
            <span className="text-xs text-gray-400">
              {format(new Date(lastMessage.createdAt), 'p')}
            </span>
          )}
        </div>
        <p className="text-sm truncate text-gray-500">
          {lastMessageText}
        </p>
      </div>

    </div>
  );
};
export default ConversationBox;