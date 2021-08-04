import ChatModel from "@models/Chat.model";
import UserModel from "@models/User.model";
import { addMessageToChat, getAllUsersOfChat, markAllMessagesReadByChatId } from "@services/chat.service";
import { getChatsByUserIdService } from "@services/user.service";
import { createMessage } from "controllers/message.controller";
import { Server, Socket } from "socket.io";

const EVENTS = {
  connection: "connection",
  disconnect: "disconnect",
  SEND_MESSAGE_TO_SERVER: "SEND_MESSAGE_TO_SERVER",
  SEND_MESSAGE_TO_CLIENT: "SEND_MESSAGE_TO_CLIENT",
  JOIN_ROOM: "JOIN_ROOM",
};

const userToSocketMap: Record<string, string> = {};

function deleteByVal(object: Record<string, string>, value: string) {
  for (var key in object) {
    if (object[key] == value) delete object[key];
  }
}

function getKeyByValue(object: Record<string, string>, value: string) {
  return Object.keys(object).find((key) => object[key] === value);
}

function socket({ io }: { io: Server }) {
  console.log("Socket Enabled");

  io.on(EVENTS.connection, async (socket: Socket) => {
    console.log(`User Connected ${socket.id}`);

    const userId = socket.handshake.query.userId as string;
    userToSocketMap[userId] = socket.id;
    const chats = await getChatsByUserIdService(userId);

    socket.emit("GET_CHATS", chats);

    const notifications: Record<string, string> = {};
    await Promise.all(
      chats!.map(async (chat) => {
        //@ts-ignore
        const noOfNotifications = await chat.getNoOfNotifications(userId);
        const chatId = chat!._id as string;
        notifications[chatId] = noOfNotifications;
      })
    );
    socket.emit("GET_NOTIFICATIONS", notifications);

    // listen to join room event , chatId == roomId
    socket.on(EVENTS.JOIN_ROOM, (chat) => {
      console.log("joining room ", "socket ", socket.id, " chat ", chat.chatName);

      socket.join(chat.chatName);

      // make all notifications read in this chat

      // get the user using the socket id
     const userId =  getKeyByValue(userToSocketMap, socket.id) as string
     userId && markAllMessagesReadByChatId(userId,chat._id)
    });

    // listen to message from client
    socket.on(EVENTS.SEND_MESSAGE_TO_SERVER, async ({ sender, chatId, text, file, chatName }) => {
      //1. get all users of the chat
      const chat = await getAllUsersOfChat(chatId);
      const users = chat!.users as unknown as string[];

      //2. map over the array and create new array of objects with status

      const onlineNotActiveUsersOfRoom: string[] = [];
      const receivers = users?.map((user) => {
        // online users
        const socketId = userToSocketMap[user]; //socketId = undefined if not in map => offline
        // console.log({ user, socketId });

        let inRoom;

        // if online , check if active in the room
        if (socketId) {
          if (io.sockets.adapter.rooms.get(chatName)?.has(socketId)) inRoom = true;
          else onlineNotActiveUsersOfRoom.push(socketId);
        }

        return {
          userId: user,
          status: inRoom ? "seen" : socketId ? "delivered" : "sent",
        };
      });

      const message = await addMessageToChat({
        sender,
        text,
        file,
        chatId,
        receivers,
      });
      console.log("message text", message.text);

      //Todo change all chat name to chat id, this is just for dev
      io.to(chatName).emit(EVENTS.SEND_MESSAGE_TO_CLIENT, message);

      // SEND NOTIFICATION to online users //! already sending chatId
      onlineNotActiveUsersOfRoom.map((socketId) => io.to(socketId).emit("NOTIFY", chatId));

      const chats = await getChatsByUserIdService(userId);

      socket.emit("GET_CHATS", chats);
    });

    socket.on("error", function (err) {
      console.log(err);
    });

    socket.on(EVENTS.disconnect, () => {
      console.log(`User Disconnected ${socket.id} `);
      deleteByVal(userToSocketMap, socket.id);
    });
  });
}
export default socket;

// https://stackoverflow.com/questions/23045245/one-line-check-if-socket-is-in-given-room

/*  chatUsers.map(user=>{
      // online users
      const socketId = map[user]
      // socketId undefined if not online | not in map
      let inRoom;
      if(socketId){ // means online
        inRoom =  room.includes(socketId)
      }
      obj = {
      user:user,
      status: inRoom ?'seen':socketId?'delivered':'sent'
      }
      return obj
      
      }) */
