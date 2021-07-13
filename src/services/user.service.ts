import { User as IUser } from "../libs/types";
import User from "@models/User.model";
import { Error } from "mongoose";
import UserModel from "@models/User.model";

export async function createUser(data: IUser) {
  try {
    return await User.create(data);
  } catch (error) {
    console.error(error.message);
    throw new Error(error);
  }
}

export const getChatsByUserIdService = async (userId:string) => {
  return await UserModel.findById(userId, "chats").populate({
    path: "chats",
    select: "groupIcon latestMessage chatName",
    populate: {
      path: "latestMessage",
    },
    options: { sort: { updatedAt: -1 } },
  })
}

