import express from "express";
import { authorizeRoles } from "../../middleware/jwtToken";
import { getDashboardStats } from "./admin.controller";


const router = express.Router();

router.get('/dashboard', authorizeRoles('admin'), getDashboardStats);

export default router;