import ChatModel from "@models/Chat.model";
import MessageModel from "@models/Message.model";
import asyncHandler from "express-async-handler";

//@ desc Get all Chats
//@ route GET /api/chats/

export const getAllChats = asyncHandler(async (req, res) => {
  const chats = await ChatModel.find({});
  res.json(chats);
});

//@ desc Get Chats by id
//@ route GET /api/v1/:id/chats/
//@ access Private/Admin

export const getChatById = asyncHandler(async (req, res) => {
  const chat = await ChatModel.findById(req.params.id);
  if (chat) {
    return res.json(chat);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});
//@ desc Get Chats by id
//@ route GET /api/v1/:id/chats/
//@ access Private/Admin

export const createChat = asyncHandler(async (req, res) => {
  /*  {
    users : UserId[],
    createdBy : User,
    isGroupChat:boolean,
    chatName:string
    ---
    message ?: Message Data ( If the chat is not a group chat and messaged first time(created personal chat))
    ----
    add time
  }
 */

  //! 1. extract the data
  const { users, createdBy, isGroupChat, message, chatName, medias } = req.body;

  //! 2. validate the data

  //! prepare the data
  const normalUsers = users;
  const adminUsers = [createdBy];

  //! 3. create the chat and add the users
  const chat = await ChatModel.create({
    chatName,
    isGroupChat,
    normalUsers,
    adminUsers,
    createdBy,
  });

  //! 4. add message

  //! 5. save the data

  //! 6. send response

  if (chat) {
    return res.json(chat);
  }
});

//@ desc Post Message in a chat
//@ route GET /api/chats/:id/message
//@ access Private/Admin

export const addMessage = asyncHandler(async (req, res) => {
  /* 
{
  content :text,
  createdBy:User,
  media
  chatId,
} */

  const { content, sender, media, chatId } = req.body;

  //! validate

  if (!content && !media)
    return res.status(400).json({ message: "validation failed" });
  //! check if chatId exist or nor

  // const chat = await ChatModel.findById(chatId);
  // if (!chat) return res.status(404);

  //!prepare data , handle media

  //! create Message object
  const message = await MessageModel.create({
    content,
    sender,
    chat: chatId,
  });

  //! add the message id in chat.messages
  const chat = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $push: { messages: message._id },
    },
    { new: true }
  );
  return res.status(200).json(chat);
});
