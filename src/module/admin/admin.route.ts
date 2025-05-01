import express from "express";
import { authorizeRoles, verifyToken } from "../../middleware/jwtToken";
import { getDashboardStats } from "./admin.controller";


const router = express.Router();

router.get('/dashboard', verifyToken, authorizeRoles('admin'), getDashboardStats);

export default router;