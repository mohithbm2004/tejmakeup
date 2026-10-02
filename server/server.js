import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import auth from './routes/auth.js';
import portfolio from './routes/portfolio.js';
import services from './routes/services.js';
import testimonials from './routes/testimonials.js';
import about from './routes/about.js';
import beforeAfter from './routes/beforeAfter.js';
import bookings from './routes/bookings.js';
import settings from './routes/settings.js';
import stats from './routes/stats.js';

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
  })
);

// CORS configuration supporting CLIENT_URL and dev origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Dev convenience
    },
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// API Routes
app.use('/api/auth', auth);
app.use('/api/portfolio', portfolio);
app.use('/api/services', services);
app.use('/api/testimonials', testimonials);
app.use('/api/about', about);
app.use('/api/before-after', beforeAfter);
app.use('/api/bookings', bookings);
app.use('/api/settings', settings);
app.use('/api/stats', stats);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

await connectDB();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
