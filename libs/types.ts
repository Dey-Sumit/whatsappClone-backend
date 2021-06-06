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
  chats?: [];
}
export interface Chat {
  chatName: string;
  description?: string;
  groupIcon?: string;
  isGroupChat: boolean;
  normalUsers?: User[];
  adminUsers: User[];
  messages?: Message[];
  latestMessage?: Message;
  createdBy: User;
  medias?: string[];
}
export interface Message {
  sender: User;
  content?: string;
  chat?: Chat;
  media?: string;
}
