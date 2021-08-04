import { Message } from "@libs/types";
import ChatModel from "@models/Chat.model";
import MessageModel from "@models/Message.model";

//TODO handle errors
export const addMessageToChat = async ({
  sender,
  chatId,
  file,
  text,
  receivers,
}: message): Promise<Message> => {
  // const message = await MessageModel.create({
  //   text,
  //   sender,
  //   chat: chatId,
  //   receivers,
  // });

  let message = new MessageModel({
    text,
    sender,
    chat: chatId,
    receivers,
  });
  await message.save();
  message = await message.populate("sender", "username _id").execPopulate();

  // await not needed , asyncly done as we don't need immediately
  await ChatModel.findByIdAndUpdate(chatId, {
    $push: { messages: message._id },
    latestMessage: message._id,
  });
  return message;
};

export const markAllMessagesReadByChatId = async (userId: string, chatId: string) => {
  const chat = await ChatModel.findById(chatId, "messages");
  MessageModel.updateMany({ _id: { $in: chat!.messages } }).update({
    $set: { receivers: "active" },
  });
  MessageModel.updateOne(
    { _id: "", "receivers.userId": "userId" },
    { $set: { "chat.$.": `date` } }
  );
};

// get all messages of that chat
// `up` all message's receivers field : if receiver.userId = "" then receiver.status = ""

interface message {
  sender: string;
  chatId: string;
  receivers: {
    userId: string;
    status: string;
  }[];
  text?: string;
  file?: string;
}

export const getAllUsersOfChat = async (id: string) => {
  return await ChatModel.findById(id);
};
