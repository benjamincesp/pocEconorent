import express from 'express';
import cors from 'cors';
import travelRoutes from './routes/travelRoutes';
import emailRoutes from './routes/emailRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/travel', travelRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
  const baseUrl = process.env.HEROKU_APP_URL || `http://localhost:${PORT}`;

  res.json({
    message: 'EconoRent POC Microservice',
    version: '1.0.0',
    webhookUrl: `${baseUrl}/api/email/gmail-webhook`,
    endpoints: {
      validateTravel: 'POST /api/travel/validateTravel',
      gmailWebhook: 'POST /api/email/gmail-webhook',
      emailLogs: 'GET /api/email/logs',
      emailTest: 'GET /api/email/test'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;