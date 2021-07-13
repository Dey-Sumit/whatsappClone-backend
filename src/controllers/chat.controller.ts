import ChatModel from "@models/Chat.model";
import MessageModel from "@models/Message.model";
import UserModel from "@models/User.model";
import asyncHandler from "express-async-handler";

//@ desc Get all Chats
//@ route GET /api/chats/

export const getAllChats = asyncHandler(async (req, res) => {
  //TODO get only chats where user is a part, only return  { latestMessage, chatName, groupIcon } these data
  const chats = await ChatModel.find({});
  res.json(chats);
});

//@ desc Get Chats by id
//@ route GET /api/v1/:id/chats/
//@ access Private/Admin

export const getChatById = asyncHandler(async (req, res) => {
  const chat = await ChatModel.findById(req.params.id)
    .populate({
      path: "messages",
      populate: {
        path: "sender",
      },
    })
    .populate("adminUsers")
    .populate("normalUsers");
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

  // 60ea7ffea8810838600dedaf auser
  // 60ea8245f69a9e39e8a8a5cc buser

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

  //TODO add chat for every user
  const usersId = [...normalUsers, ...adminUsers];

  usersId.map(async (uid: string) => {
    await UserModel.findByIdAndUpdate(uid, {
      $addToSet: {
        chats: chat._id,
      },
    });
  });

  //!TODO 4. add message

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

  const { text, sender, media, chatId } = req.body;

  //! validate

  if (!text && !media) return res.status(400).json({ message: "validation failed" });
  //! check if chatId exist or nor

  // const chat = await ChatModel.findById(chatId);
  // if (!chat) return res.status(404);

  //!prepare data , handle media

  //! create Message object
  const message = await MessageModel.create({
    text,
    sender,
    chat: chatId,
  });

  //! add the message id in chat.messages
  const chat = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $push: { messages: message._id },
      latestMessage: message._id,
    },
    { new: true }
  )
    .populate("messages")
    .populate("latestMessage")
    .populate("adminUsers")
    .sort("latestMessage.createdAt");

  return res.status(200).json(chat);
});

// export const addUnreadMessage = asyncHandler(async (req, res) => {


  

//   return res.status(200).json(chat);
// });
