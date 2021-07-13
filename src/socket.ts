import ChatModel from "@models/Chat.model";
import UserModel from "@models/User.model";
import { addMessageToChat } from "@services/chat.service";
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

function deleteByVal(val: string, obj: Record<string, string>) {
  for (var key in obj) {
    if (obj[key] == val) delete obj[key];
  }
}
function socket({ io }: { io: Server }) {
  console.log("Socket Enabled");

  io.on(EVENTS.connection, async (socket: Socket) => {
    console.log(`User Connected ${socket.id}`);

    const userId = socket.handshake.query.userId as string;

    const user = await getChatsByUserIdService(userId);

    socket.emit("GET_CHATS", user!.chats);

    // const user = await UserModel.findById(userId).select("chats");

    //@ts-ignore
    // user?.chats!.map((chatId) => socket.join(chatId.toString()));

    //!chatId == roomId
    socket.on(EVENTS.JOIN_ROOM, (roomId) => {
      console.log("joining room ", "socket ", socket.id, " chat ", roomId);

      socket.join(roomId);
    });

    // console.log(io.sockets.adapter.rooms);

    socket.on(EVENTS.SEND_MESSAGE_TO_SERVER, async ({ sender, chatId, text, file, chatName }) => {
      const message = await addMessageToChat({
        sender,
        text,
        file,
        chatId,
      });
      console.log("message text", message.text);

      //Todo change all chat name to chatid, this is just for dev
      io.to(chatName).emit(EVENTS.SEND_MESSAGE_TO_CLIENT, message);

      const user = await getChatsByUserIdService(userId);

      socket.emit("GET_CHATS", user!.chats);
    });
    socket.on("error", function (err) {
      console.log(err);
    });

    socket.on(EVENTS.disconnect, () => {
      console.log(`User Disconnected ${socket.id} `);
      deleteByVal(socket.id, userToSocketMap);
    });
  });
}
export default socket;
