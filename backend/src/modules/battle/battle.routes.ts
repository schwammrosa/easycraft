import { Router } from 'express';
import { battleController } from './battle.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/battle/:characterId/enemies
 * @desc    Get available enemies for character
 * @access  Private
 */
router.get('/:characterId/enemies', (req, res) => battleController.getEnemies(req, res));

/**
 * @route   POST /api/battle/:characterId/start
 * @desc    Start a battle
 * @access  Private
 */
router.post('/:characterId/start', (req, res) => battleController.startBattle(req, res));

/**
 * @route   POST /api/battle/:characterId/rest
 * @desc    Rest to recover HP
 * @access  Private
 */
router.post('/:characterId/rest', (req, res) => battleController.rest(req, res));

export default router;
