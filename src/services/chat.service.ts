import { Message } from "@libs/types";
import ChatModel from "@models/Chat.model";
import MessageModel from "@models/Message.model";

//TODO handle errors
export const addMessageToChat = async ({
  sender,
  chatId,
  file,
  text,
}: message): Promise<Message> => {
  const message = await MessageModel.create({
    text,
    sender,
    chat: chatId,
  });
  await ChatModel.findByIdAndUpdate(chatId, {
    $push: { messages: message._id },
    latestMessage: message._id,
  });
  return message;
};
interface message {
  sender: string;
  chatId: string;
  text?: string;
  file?: string;
}
