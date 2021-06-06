import { deleteUser, getUserById } from "controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/:id", getUserById);
router.delete("/delete", deleteUser);

export default router;
