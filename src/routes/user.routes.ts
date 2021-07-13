import {
  deleteUser,
  getAllUsers,
  getChatsByUserId,
  getUserById,
  searchUserByUsername,
} from "controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/search", searchUserByUsername);
router.get("/:id", getUserById);
router.get("/:id/chats", getChatsByUserId);
router.delete("/delete", deleteUser);

export default router;
