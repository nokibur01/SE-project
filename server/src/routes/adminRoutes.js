import express from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/overview", verifyToken, getAdminOverview);

export default router;
