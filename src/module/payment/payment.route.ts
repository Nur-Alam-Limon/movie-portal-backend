import { Router } from 'express';
import { authorizeRoles, verifyToken } from '../../middleware/jwtToken';
import { getAllTransactions, getMyTransactions, initiatePayment, initiatePaymentCancel, initiatePaymentFailure, initiatePaymentSuccess } from './payment.controller';

const router = Router();

router.get("/transactions", verifyToken, getMyTransactions);
router.get("/admin/transactions", verifyToken, authorizeRoles("admin"), getAllTransactions); 
router.post("/initiate-payment", verifyToken, initiatePayment);
router.post("/ssl/success/:id", initiatePaymentSuccess);
router.post('/ssl/fail/:id', initiatePaymentFailure);
router.post('/ssl/cancel/:id', initiatePaymentCancel);

export default router;
