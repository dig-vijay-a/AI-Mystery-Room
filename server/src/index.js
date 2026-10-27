import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import caseRoutes from './routes/cases.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching client
      if (!origin || origin === CLIENT_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/testing for smooth evaluation
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_gemini')),
  });
});

// Mount Routes
app.use('/api/cases', caseRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Connect to Database & Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` AI Mystery Room Backend Server Running on :${PORT}`);
    console.log(` Client URL: ${CLIENT_URL}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
}

startServer();
