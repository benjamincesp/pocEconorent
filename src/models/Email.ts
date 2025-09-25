export interface EmailNotification {
  message: {
    data: string;
    messageId: string;
    message_id: string;
    publishTime: string;
    publish_time: string;
  };
  subscription: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  historyId: string;
}

export interface EmailData {
  messageId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  receivedAt: Date;
  snippet: string;
}

export interface EmailLogEntry {
  id?: string;
  emailData: EmailData;
  processedAt: Date;
  status: 'received' | 'processed' | 'error';
  metadata?: any;
}