"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const EmailService_1 = require("../services/EmailService");
class EmailController {
    constructor() {
        this.gmailWebhook = async (req, res) => {
            try {
                console.log('Gmail webhook received:', JSON.stringify(req.body, null, 2));
                const notification = req.body;
                if (!notification.message || !notification.message.data) {
                    res.status(400).json({ error: 'Invalid notification format' });
                    return;
                }
                const decodedData = Buffer.from(notification.message.data, 'base64').toString();
                const gmailMessage = JSON.parse(decodedData);
                console.log('Decoded Gmail message:', gmailMessage);
                await this.emailService.processEmailNotification(gmailMessage);
                res.status(200).json({
                    message: 'Email notification processed successfully',
                    messageId: gmailMessage.id
                });
            }
            catch (error) {
                console.error('Error in Gmail webhook:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    message: 'Failed to process email notification'
                });
            }
        };
        this.getEmailLogs = async (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 50;
                const logs = await this.emailService.getEmailLogs(limit);
                res.status(200).json({
                    logs,
                    total: logs.length
                });
            }
            catch (error) {
                console.error('Error getting email logs:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    message: 'Failed to retrieve email logs'
                });
            }
        };
        this.testEndpoint = async (req, res) => {
            console.log('Test endpoint hit - Gmail webhook is working!');
            res.status(200).json({
                message: 'Gmail webhook test successful',
                timestamp: new Date().toISOString(),
                endpoint: '/api/email/gmail-webhook'
            });
        };
        this.emailService = new EmailService_1.EmailService();
    }
}
exports.EmailController = EmailController;
//# sourceMappingURL=EmailController.js.map