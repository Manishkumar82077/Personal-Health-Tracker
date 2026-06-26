import express from 'express';
import cors from 'cors';
import './config/firebase';
import { verifyToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/index';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', verifyToken, apiRoutes);
app.use(errorHandler);

export default app;
