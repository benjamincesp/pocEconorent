import { Request, Response } from 'express';
import { EmailService } from '../services/EmailService';
import { EmailNotification, GmailMessage } from '../models/Email';

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  gmailWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Gmail webhook received:', JSON.stringify(req.body, null, 2));

      const notification: EmailNotification = req.body;

      if (!notification.message || !notification.message.data) {
        res.status(400).json({ error: 'Invalid notification format' });
        return;
      }

      const decodedData = Buffer.from(notification.message.data, 'base64').toString();
      const gmailMessage: GmailMessage = JSON.parse(decodedData);

      console.log('Decoded Gmail message:', gmailMessage);

      await this.emailService.processEmailNotification(gmailMessage);

      res.status(200).json({
        message: 'Email notification processed successfully',
        messageId: gmailMessage.id
      });

    } catch (error) {
      console.error('Error in Gmail webhook:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process email notification'
      });
    }
  };

  getEmailLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await this.emailService.getEmailLogs(limit);

      res.status(200).json({
        logs,
        total: logs.length
      });

    } catch (error) {
      console.error('Error getting email logs:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve email logs'
      });
    }
  };

  testEndpoint = async (req: Request, res: Response): Promise<void> => {
    console.log('Test endpoint hit - Gmail webhook is working!');
    res.status(200).json({
      message: 'Gmail webhook test successful',
      timestamp: new Date().toISOString(),
      endpoint: '/api/email/gmail-webhook'
    });
  };
}