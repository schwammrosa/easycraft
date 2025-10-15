import { Router } from 'express';
import { dungeonController } from './dungeon.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// Public routes (list dungeons)
router.get('/', dungeonController.getAllDungeons);
router.get('/:id', dungeonController.getDungeonById);
router.get('/:dungeonId/leaderboard', dungeonController.getLeaderboard);

// Protected routes (require authentication)
router.use(authenticate);

router.get('/:characterId/can-enter/:dungeonId', dungeonController.canEnterDungeon);
router.post('/:characterId/enter', dungeonController.enterDungeon);
router.post('/:characterId/battle', dungeonController.battleFloor);
router.get('/:characterId/active', dungeonController.getActiveRun);
router.get('/:characterId/history', dungeonController.getRunHistory);

export default router;
