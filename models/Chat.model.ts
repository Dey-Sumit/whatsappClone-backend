import mongoose, { Document } from "mongoose";
import { Chat } from "../libs/types";
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true },
    description: { type: String, trim: true },
    GroupIcon: {
      type: String,
      default:
        "https://buildyourspechere.com/wp-content/uploads/2020/10/placeholder-image-person-jpg.jpg",
    },
    isGroupChat: { type: Boolean, default: false },
    normalUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // admins will not be included here
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
        //URL(s)
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<Chat & Document>("Chat", chatSchema);
