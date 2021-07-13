import mongoose, { Document } from "mongoose";
import { Message } from "../libs/types";
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    media: {
      //URL
      type: String,
    },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }], //?
  },
  { timestamps: true }
);

export default mongoose.model<Message & Document>("Message", messageSchema);

/* {
var x = message :[
    {
    delivers : [{userId:1,status:1},{userId:2,status:1},{userId:3,status:0},{userId:4,status:2}]
  },
    {
    delivers : [{userId:1,status:1},{userId:2,status:1},{userId:3,status:0},{userId:4,status:2}]
  },
    {
    delivers : [{userId:1,status:1},{userId:2,status:1},{userId:3,status:0},{userId:4,status:2}]
  },
    {
    delivers : [{userId:1,status:1},{userId:2,status:1},{userId:3,status:0},{userId:4,status:2}]
  },

]
}


let no = 0;
x.messages.forEach(message=>{
const y = message.delivers.filter(deliver=>deliver.userId == 1 && deliver.status == 1)
no = no + y.length
})

*/
