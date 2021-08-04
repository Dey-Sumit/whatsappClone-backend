import { Request } from "express";

export interface ExtendedRequest extends Request {
  user?: User; // ts will not give any error if the user is optional
}

// https://stackoverflow.com/questions/54030381/unable-to-extend-express-request-in-typescript

export interface User {
  username: string;
  bio?: string;
  profilePicture?: string;
  password: string;
  chats?: Chat[];
}
export interface Chat {
  chatName: string;
  description?: string;
  groupIcon?: string;
  isGroupChat: boolean;
  users?: User[];
  adminUsers: User[];
  messages?: Message[];
  latestMessage?: Message;
  createdBy: User;
  medias?: string[];
  _id?: string;
}
export interface Message {
  sender: User;
  text?: string;
  chat?: Chat;
  media?: string;
  receivers: {
    userId: string;
    status: string;
  }[];
}
