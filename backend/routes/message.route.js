import express from "express";
import { getMessages, sendMessage, getConversations } from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/conversations").get(isAuthenticated, getConversations);
router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/:id").get(isAuthenticated, getMessages);

export default router; 