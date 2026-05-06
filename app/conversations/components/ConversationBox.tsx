'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import clsx from 'clsx';
import { FullConversationType } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import { useAuth } from '@/app/context/AuthContext';

interface ConversationBoxProps {
  conversation: FullConversationType;
  selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  conversation,
  selected,
}) => {
  const { user } = useAuth();
  const otherUser = useOtherUser(conversation);
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [conversation.id, router]);

  const lastMessage = useMemo(() => {
    return conversation.messages?.[conversation.messages.length - 1];
  }, [conversation.messages]);

  const hasSeen = useMemo(() => {
    if (!lastMessage || !user) return false;

    return lastMessage.seen?.some(
      (u) => u.id === user._id
    );
  }, [lastMessage, user]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return 'Sent an image';
    if (lastMessage?.body) return lastMessage.body;
    return 'Started a chat...';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-neutral-100',
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {conversation.isGroup ? (
        <AvatarGroup users={conversation.users} />
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

        <p
          className={clsx(
            'text-sm truncate',
            hasSeen ? 'text-gray-500' : 'font-semibold text-black'
          )}
        >
          {lastMessageText}
        </p>
      </div>
    </div>
  );
};

export default ConversationBox;