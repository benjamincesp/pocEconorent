"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmailController_1 = require("../controllers/EmailController");
const router = (0, express_1.Router)();
const emailController = new EmailController_1.EmailController();
router.post('/gmail-webhook', emailController.gmailWebhook);
router.get('/logs', emailController.getEmailLogs);
router.get('/test', emailController.testEndpoint);
exports.default = router;
//# sourceMappingURL=emailRoutes.js.map