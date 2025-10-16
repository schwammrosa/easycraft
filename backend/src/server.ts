import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './config/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/battle', battleRoutes);
app.use('/api/quest', questRoutes);
app.use('/api/crafting', craftingRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/dungeons', dungeonRoutes);

// Temporary seed route (REMOVE IN PRODUCTION!)
app.post('/api/admin/seed', async (_req, res) => {
  try {
    const { exec } = require('child_process');
    exec('npx prisma db seed', { cwd: __dirname + '/../' }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        logger.error(`Seed error: ${error.message}`);
        return res.status(500).json({ success: false, error: error.message });
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
