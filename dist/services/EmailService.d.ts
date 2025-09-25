import { EmailLogEntry, GmailMessage } from '../models/Email';
export declare class EmailService {
    private firestore;
    private gmail;
    constructor();
    processEmailNotification(gmailMessage: GmailMessage): Promise<void>;
    private fetchEmailData;
    private getHeaderValue;
    private extractMessageBody;
    private logEmail;
    private logError;
    getEmailLogs(limit?: number): Promise<EmailLogEntry[]>;
}
//# sourceMappingURL=EmailService.d.ts.map