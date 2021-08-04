import mongoose, { Document } from "mongoose";
import { Chat } from "../libs/types";
import ChatModel from "@models/Chat.model";

const Schema = mongoose.Schema;

const chatSchema = new Schema<ChatDocument>(
  {
    chatName: { type: String, trim: true }, // if no chatName ,it means it's a personal chat
    description: { type: String, trim: true },

    groupIcon: {
      type: String,
      default:
        "https://buildyourspechere.com/wp-content/uploads/2020/10/placeholder-image-person-jpg.jpg",
    },

    isGroupChat: { type: Boolean, default: false },

    users: [{ type: Schema.Types.ObjectId, ref: "User" }], // including admins

    adminUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],

    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medias: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

type ChatDocument = Chat & Document;

// chatSchema.virtual("noOfNotifications").get(function (this: ChatDocument) {
//   let no = 0;

//   this.messages!.forEach((message) => {
//     const y = message.receivers.filter(
//       (deliver) => deliver.userId == "" && deliver.status == "delivered"
//     );
//     no = no + y.length;
//   });
//   return no;
// });

chatSchema.methods.getNoOfNotifications = async function (user: string) {
  const chats = await ChatModel.findById(this._id).populate("messages", "receivers");

  let no = 0;

  chats!.messages!.forEach((message) => {
    console.log(message.receivers);
    const y = message.receivers.filter(
      (receiver) => receiver.userId == user && receiver.status == "delivered"
    );
    no = no + y.length;
  });
  console.log({ user, no });

  return no;
};

export default mongoose.model<ChatDocument>("Chat", chatSchema);
