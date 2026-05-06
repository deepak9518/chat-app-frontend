// ===== Base =====
export type ObjectId = string;

// ===== User =====
export interface User {
  _id: ObjectId;
  name: string;
  email: string;

  about?: string;
  birthday?: Date;
  height?: number;
  weight?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

// ===== Room (after toJSON transform) =====
export interface Room {
  _id: ObjectId;
  name: string;
  type: 'PERSONAL' | 'GROUP';

  // ⚠️ IMPORTANT: populated via autopopulate + transform
  members: User[];

  createdAt: Date;
  updatedAt: Date;
}

// ===== Message =====
export interface Message {
  _id: ObjectId;
  content: string;

  room_id: ObjectId;

  // ⚠️ autopopulated
  sender_id: User;

  createdAt: Date;
  updatedAt: Date;
}

// ===== UI TYPES =====

export type FullMessageType = Message;

export type FullRoomType = Room & {
  messages: Message[];
};