import express from "express";
import protectRoute from "../middleWares/protectRoute.js";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controlllers/messageController.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);

export default router;
