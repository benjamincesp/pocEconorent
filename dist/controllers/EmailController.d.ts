import { Request, Response } from 'express';
export declare class EmailController {
    private emailService;
    constructor();
    gmailWebhook: (req: Request, res: Response) => Promise<void>;
    getEmailLogs: (req: Request, res: Response) => Promise<void>;
    testEndpoint: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=EmailController.d.ts.map