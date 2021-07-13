import extractUser from "@libs/extractUser";
import UserModel from "@models/User.model";
import { getChatsByUserIdService } from "@services/user.service";

import asyncHandler from "express-async-handler";

//@desc Delete user
//@route DELETE /api/v1/users/:id
//@access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get all users
// @route GET /api/users/

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
});

//@desc Get user by id
//@route GET /api/v1/users/:id
//@access Private/Admin

export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (user) {
    return res.json(extractUser(user));
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Get search user by username
//@route GET /api/query?q=""

export const searchUserByUsername = asyncHandler(async (req, res, next) => {
  const q = req.query.q?.toString();
  if (!q) {
    return res.status(404).json({ message: "please pass the keyword" });
  }

  //! needs upgrade to sort relevant results, use elastic search
  const users = await UserModel.find({
    username: {
      $regex: q,
      $options: "i",
    },
  });
  res.status(200).json(users);
});

//@ desc Get Chats by id
//@ route GET /api/v1/user/
//@ access Private/Admin

export const getChatsByUserId = asyncHandler(async (req, res) => {
  const chats = await getChatsByUserIdService(req.params.id);

  if (chats) {
    return res.json(chats);
     }
});
