import { Router } from 'express';
import { crearIntentoDePago } from '../controllers/paymentController';

const router = Router();

router.post('/create-payment-intent', crearIntentoDePago);

export default router;