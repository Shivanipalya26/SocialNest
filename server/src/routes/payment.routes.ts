import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import {
  getPaymentDetails,
  getPaymentDetailsByOrderId,
  getPricing,
  getSubscriptionDetails,
} from '../controllers/payment.controller';

const paymentRouter = Router();

paymentRouter.get('/', verifyToken, getPaymentDetails);
paymentRouter.get('/pricing', getPricing);
paymentRouter.get('/subscription', verifyToken, getSubscriptionDetails);
paymentRouter.post('/', verifyToken, getPaymentDetailsByOrderId);

export default paymentRouter;
