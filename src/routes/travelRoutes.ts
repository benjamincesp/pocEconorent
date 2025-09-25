import { Router } from 'express';
import { TravelController } from '../controllers/TravelController';

const router = Router();
const travelController = new TravelController();

router.post('/validateTravel', travelController.validateTravel);

export default router;