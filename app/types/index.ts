export type ObjectId = string;

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
 
  online?: boolean;
  lastSeen?: Date;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Room {
  _id: ObjectId;
  name: string;
  type: 'personal' | 'group';
  members: User[];
  invitedUsers?: User[];
  invitedEmails?: string[];
  createdAt: Date;
  updatedAt: Date;
  unreadCount?: number;
  lastMessage?: { content: string; createdAt: Date } | null;
}

export interface Chat {
  _id: ObjectId;
  content: string;
  room_id: ObjectId;
  sender_id: User;
  attachments?: { url: string; type: string; name: string }[];
  readBy: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type FullRoomType = Room & { messages?: Chat[] };
export type FullMessageType = Chat;