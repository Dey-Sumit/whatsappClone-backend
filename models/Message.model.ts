import mongoose, { Document } from "mongoose";
import { Message } from "../libs/types";
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    media: {
      //URL
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Message & Document>("Message", messageSchema);
