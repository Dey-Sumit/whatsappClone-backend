import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../libs/types";

// TODO add typescript
const UserSchema = new Schema<any>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    bio: {
      type: String,
    },
    profilePicture: {
      type: String,
      default:
        "https://buildyourspechere.com/wp-content/uploads/2020/10/placeholder-image-person-jpg.jpg",
    },
    password: {
      type: String,
      required: true,
    },
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
   
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

// methods
// UserSchema.methods.matchPassword = async function (
//   this,
//   enteredPassword: string
// ) {
//   console.log({ enteredPassword }, this.password);

//   return await bcrypt.compare(enteredPassword, this.password);
// };

// middleware before saving the data
// hash the password during registration
UserSchema.pre("save", async function (this, next: Function) {
  // run oly if the password field is modified (ex: during update profile)
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});




interface UserDoc extends User, Document {
  matchPassword: (candidatePassword: string) => Promise<boolean>;
}

export default mongoose.model<UserDoc>("User", UserSchema);

// unseenMessages: {
//   chatId1 : [messageId,messageId,messageId,messageId ] / 3,
//   chatId2 : [messageId,messageId,messageId,messageId ] / 2,
//   chatId3 : [messageId,messageId,messageId,messageId ],
// }