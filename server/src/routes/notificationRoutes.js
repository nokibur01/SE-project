import express from "express";
import {
  getNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, getNotifications);
router.delete("/:id", verifyToken, deleteNotification); // 👈 নতুন রাউট

export default router;
