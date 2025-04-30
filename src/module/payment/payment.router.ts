import { Router } from 'express';
import { verifyToken } from '../../middleware/jwtToken';
import { initiatePayment, initiatePaymentCancel, initiatePaymentFailure, initiatePaymentSuccess } from './payment.controller';

const router = Router();

router.post("/initiate-payment", verifyToken, initiatePayment);
router.post("/ssl/success/:id", initiatePaymentSuccess);
router.post('/ssl/fail', initiatePaymentFailure);
router.post('/ssl/cancel', initiatePaymentCancel);

export default router;
