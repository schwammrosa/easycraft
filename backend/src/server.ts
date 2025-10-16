import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { logger } from './config/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
  'http://localhost:5173', 
  'http://localhost:5174',
  'https://easycraft.vercel.app'
];

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images, sprites, etc.)
app.use('/assets', express.static(path.join(__dirname, '../assets')));
logger.info(`📂 Assets folder: ${path.join(__dirname, '../assets')}`);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Routes
import authRoutes from './modules/auth/auth.routes';
import characterRoutes from './modules/character/character.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import itemRoutes from './modules/item/item.routes';
import battleRoutes from './modules/battle/battle.routes';
import questRoutes from './modules/quest/quest.routes';
import craftingRoutes from './modules/crafting/crafting.routes';
import marketplaceRoutes from './modules/marketplace/marketplace.routes';
import dungeonRoutes from './modules/dungeon/dungeon.routes';
import gatheringRoutes from './modules/gathering/gathering.routes';

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/battle', battleRoutes);
app.use('/api/quest', questRoutes);
app.use('/api/crafting', craftingRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/dungeons', dungeonRoutes);
app.use('/api/gathering', gatheringRoutes);

// Temporary seed route (REMOVE IN PRODUCTION!)
app.post('/api/admin/seed', (_req, res) => {
  try {
    const { exec } = require('child_process');
    exec('npx prisma db seed', { cwd: __dirname + '/../' }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        logger.error(`Seed error: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
        return;
      }
      if (stderr) {
        logger.error(`Seed stderr: ${stderr}`);
      }
      logger.info(`Seed stdout: ${stdout}`);
      res.json({ success: true, message: 'Database seeded successfully!', output: stdout });
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Emergency floor creation endpoint
app.post('/api/admin/create-floors', async (_req, res) => {
  try {
    const { exec } = require('child_process');
    exec('npm run create-floors', { cwd: __dirname + '/../' }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        logger.error(`Floor creation error: ${error.message}`);
        res.status(500).json({ success: false, error: error.message, stderr });
        return;
      }
      if (stderr) {
        logger.warn(`Floor creation stderr: ${stderr}`);
      }
      logger.info(`Floor creation stdout: ${stdout}`);
      res.json({ success: true, message: 'Dungeon floors created successfully!', output: stdout });
    });
  } catch (error: any) {
    logger.error('Error creating floors:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    }
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 EasyCraft Backend running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
