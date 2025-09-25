"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const googleapis_1 = require("googleapis");
const firestore_1 = require("@google-cloud/firestore");
class EmailService {
    constructor() {
        this.firestore = new firestore_1.Firestore();
        const auth = new googleapis_1.google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/gmail.readonly']
        });
        this.gmail = googleapis_1.google.gmail({ version: 'v1', auth });
    }
    async processEmailNotification(gmailMessage) {
        try {
            console.log('Processing email notification:', gmailMessage.id);
            const emailData = await this.fetchEmailData(gmailMessage.id);
            if (emailData) {
                await this.logEmail(emailData);
                console.log('Email logged successfully:', emailData.subject);
            }
        }
        catch (error) {
            console.error('Error processing email notification:', error);
            await this.logError(gmailMessage.id, error);
        }
    }
    async fetchEmailData(messageId) {
        try {
            const response = await this.gmail.users.messages.get({
                userId: 'me',
                id: messageId,
                format: 'full'
            });
            const message = response.data;
            if (!message)
                return null;
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
        }
        catch (error) {
            console.error('Error fetching email data:', error);
            return null;
        }
    }
    getHeaderValue(headers, name) {
        const header = headers.find(h => h.name?.toLowerCase() === name.toLowerCase());
        return header?.value || undefined;
    }
    extractMessageBody(payload) {
        if (!payload)
            return '';
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
    async logEmail(emailData) {
        const logEntry = {
            emailData,
            processedAt: new Date(),
            status: 'processed'
        };
        await this.firestore.collection('email_logs').add(logEntry);
        console.log(`📧 Email logged - From: ${emailData.from}, Subject: ${emailData.subject}`);
    }
    async logError(messageId, error) {
        const errorEntry = {
            messageId,
            error: error.message || 'Unknown error',
            processedAt: new Date(),
            status: 'error'
        };
        await this.firestore.collection('email_error_logs').add(errorEntry);
    }
    async getEmailLogs(limit = 50) {
        const snapshot = await this.firestore
            .collection('email_logs')
            .orderBy('processedAt', 'desc')
            .limit(limit)
            .get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map