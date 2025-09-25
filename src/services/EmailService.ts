import { gmail_v1, google } from 'googleapis';
import { Firestore } from '@google-cloud/firestore';
import { EmailData, EmailLogEntry, GmailMessage } from '../models/Email';

export class EmailService {
  private firestore: Firestore;
  private gmail: gmail_v1.Gmail;

  constructor() {
    this.firestore = new Firestore();
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/gmail.readonly']
    });
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  async processEmailNotification(gmailMessage: GmailMessage): Promise<void> {
    try {
      console.log('Processing email notification:', gmailMessage.id);

      const emailData = await this.fetchEmailData(gmailMessage.id);

      if (emailData) {
        await this.logEmail(emailData);
        console.log('Email logged successfully:', emailData.subject);
      }

    } catch (error) {
      console.error('Error processing email notification:', error);
      await this.logError(gmailMessage.id, error);
    }
  }

  private async fetchEmailData(messageId: string): Promise<EmailData | null> {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.data;
      if (!message) return null;

      const headers = message.payload?.headers || [];

      const from = this.getHeaderValue(headers, 'From') || 'Unknown';
      const to = this.getHeaderValue(headers, 'To') || 'Unknown';
      const subject = this.getHeaderValue(headers, 'Subject') || 'No Subject';

      const body = this.extractMessageBody(message.payload);

      return {
        messageId,
        from,
        to,
        subject,
        body,
        receivedAt: new Date(parseInt(message.internalDate || '0')),
        snippet: message.snippet || ''
      };

    } catch (error) {
      console.error('Error fetching email data:', error);
      return null;
    }
  }

  private getHeaderValue(headers: gmail_v1.Schema$MessagePartHeader[], name: string): string | undefined {
    const header = headers.find(h => h.name?.toLowerCase() === name.toLowerCase());
    return header?.value || undefined;
  }

  private extractMessageBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
    if (!payload) return '';

    if (payload.body?.data) {
      return Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          return Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      }

      for (const part of payload.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          return Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      }
    }

    return '';
  }

  private async logEmail(emailData: EmailData): Promise<void> {
    const logEntry: EmailLogEntry = {
      emailData,
      processedAt: new Date(),
      status: 'processed'
    };

    await this.firestore.collection('email_logs').add(logEntry);

    console.log(`📧 Email logged - From: ${emailData.from}, Subject: ${emailData.subject}`);
  }

  private async logError(messageId: string, error: any): Promise<void> {
    const errorEntry = {
      messageId,
      error: error.message || 'Unknown error',
      processedAt: new Date(),
      status: 'error'
    };

    await this.firestore.collection('email_error_logs').add(errorEntry);
  }

  async getEmailLogs(limit: number = 50): Promise<EmailLogEntry[]> {
    const snapshot = await this.firestore
      .collection('email_logs')
      .orderBy('processedAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as EmailLogEntry[];
  }
}