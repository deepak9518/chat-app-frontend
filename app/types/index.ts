// ===== Base Types =====
export type ObjectId = string;

// ===== User =====
export interface User {
  id: ObjectId;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  hashedPassword?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // relations
  conversationIds: ObjectId[];
  conversations?: Conversation[];

  seenMessageIds: ObjectId[];
  seenMessages?: Message[];

  accounts?: Account[];
  messages?: Message[];
}

// ===== Account =====
export interface Account {
  id: ObjectId;
  userId: ObjectId;

  type: string;
  provider: string;
  providerAccountId: string;

  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;

  // relations
  user?: User;
}

// ===== Conversation =====
export interface Conversation {
  id: ObjectId;
  createdAt: Date;
  lastMessageAt: Date;
  name?: string | null;
  isGroup?: boolean | null;

  // relations
  userIds: ObjectId[];
  users?: User[];

  messagesIds: ObjectId[];
  messages?: Message[];
}

// ===== Message =====
export interface Message {
  id: ObjectId;
  body?: string | null;
  image?: string | null;
  createdAt: Date;

  // relations
  seenIds: ObjectId[];
  seen?: User[];

  conversationId: ObjectId;
  conversation?: Conversation;

  senderId: ObjectId;
  sender?: User;
}
export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
