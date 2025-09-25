import { Router } from 'express';
import { EmailController } from '../controllers/EmailController';

const router = Router();
const emailController = new EmailController();

router.post('/gmail-webhook', emailController.gmailWebhook);
router.get('/logs', emailController.getEmailLogs);
router.get('/test', emailController.testEndpoint);

export default router;