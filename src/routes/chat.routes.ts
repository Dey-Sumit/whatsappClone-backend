import {
  createChat,
  addMessage,
  getAllChats,
  getChatById,
  getUsersByChatId,
  messageAsRead,
} from "controllers/chat.controller";
import express from "express";

const router = express.Router();

router.post("/", createChat);
router.get("/", getAllChats);
router.get("/messageAsRead", messageAsRead);
// router.post("/:id/addMember", addMember);
router.get("/:id", getChatById);
router.get("/:id/users", getUsersByChatId);
router.post("/:id/messages", addMessage);

export default router;
