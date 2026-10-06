import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve local project images statically
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
  })
);

// CORS configuration supporting CLIENT_URL, ADMIN_URL and dev origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Dev convenience
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database connection for all requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[Database Connection Error]', err);
    res.status(500).json({ message: 'Database connection error' });
  }
});

// Health check
app.get(['/health', '/api/health'], (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

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

if (!process.env.VERCEL) {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, '0.0.0.0', () => console.log(`API running on http://localhost:${port}`));
}

export default app;
