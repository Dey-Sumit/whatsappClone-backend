import MessageModel from "@models/Message.model";

//TODO do "file adding" later

interface message {
  sender: string;
  chatId: string;
  text?: string;
  file?: string;
}

export const createMessage = async ({ sender, chatId, file, text }: message) => {
  return await MessageModel.create({
    text,
    sender,
    chat: chatId,
  });
};
