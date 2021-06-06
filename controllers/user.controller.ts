import extractUser from "@libs/extractUser";
import UserModel from "@models/User.model";

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

//@desc Get user by id
//@route GET /api/v1/users/:id
//@access Private/Admin

export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (user) {
    res.json(extractUser(user));
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
