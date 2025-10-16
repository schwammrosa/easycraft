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

/**
 * @route   POST /api/battle/:characterId/farm
 * @desc    Start farm mode (auto battle with potion usage)
 * @access  Private
 */
router.post('/:characterId/farm', (req, res) => battleController.startFarmMode(req, res));

/**
 * @route   GET /api/battle/farm/:sessionId/status
 * @desc    Get farm session status
 * @access  Private
 */
router.get('/farm/:sessionId/status', (req, res) => battleController.getFarmSessionStatus(req, res));

/**
 * @route   POST /api/battle/farm/:sessionId/cancel
 * @desc    Cancel farm session
 * @access  Private
 */
router.post('/farm/:sessionId/cancel', (req, res) => battleController.cancelFarmSession(req, res));

/**
 * @route   GET /api/battle/:characterId/farm/active
 * @desc    Get active farm session for character
 * @access  Private
 */
router.get('/:characterId/farm/active', (req, res) => battleController.getActiveFarmSession(req, res));

/**
 * @route   GET /api/battle/:characterId/farm/latest
 * @desc    Get latest farm session for character (any status)
 * @access  Private
 */
router.get('/:characterId/farm/latest', (req, res) => battleController.getLatestFarmSession(req, res));

export default router;
