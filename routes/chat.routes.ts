import {
  createChat,
  addMessage,
  getAllChats,
  getChatById,
} from "controllers/chat.controller";
import express from "express";

const router = express.Router();

router.post("/", createChat);
router.get("/", getAllChats);
// router.post("/:id/addMember", addMember);
router.get("/:id", getChatById);
router.post("/:id/messages", addMessage);

export default router;
