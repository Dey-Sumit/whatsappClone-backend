import extractUser from "@libs/extractUser";
import generateToken from "@libs/generateToken";
import { User } from "@libs/types";
import UserModel from "@models/User.model";
import { createUser } from "@services/user.service";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO yup validation

    const { password, username, bio, chats, profilePicture } = req.body as User;

    if (await UserModel.findOne({ username }))
      throw new Error("username taken");

    // do I need service file?
    const user = await createUser({
      password,
      username,
      bio,
      chats,
      profilePicture,
    });
    req.user = extractUser(user);

    return res.status(200).json(req.user);
  }
);

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    const { _id, username } = user;
    req.user = user;
    res.json({
      _id,
      username,
      token: generateToken(_id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// TODO
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const user = await createUser(req.body);
    // return res.status(200).json(user);
  }
);
