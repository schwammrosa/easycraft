import { Router } from 'express';
import { characterController } from './character.controller';
import { characterStatsController } from './character-stats.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/characters
 * @desc    Get all characters for authenticated user
 * @access  Private
 */
router.get('/', (req, res) => characterController.getCharacters(req, res));

/**
 * @route   POST /api/characters
 * @desc    Create a new character
 * @access  Private
 */
router.post('/', (req, res) => characterController.createCharacter(req, res));

/**
 * @route   GET /api/characters/:id
 * @desc    Get character by ID
 * @access  Private
 */
router.get('/:id', (req, res) => characterController.getCharacter(req, res));

/**
 * @route   PUT /api/characters/:id/appearance
 * @desc    Update character appearance
 * @access  Private
 */
router.put('/:id/appearance', (req, res) => characterController.updateCharacterAppearance(req, res));

/**
 * @route   DELETE /api/characters/:id
 * @desc    Delete character
 * @access  Private
 */
router.delete('/:id', (req, res) => characterController.deleteCharacter(req, res));

/**
 * @route   POST /api/characters/:characterId/stats/distribute
 * @desc    Distribute stat points
 * @access  Private
 */
router.post('/:characterId/stats/distribute', (req, res) => characterStatsController.distributeStats(req, res));

/**
 * @route   POST /api/characters/:characterId/stats/reset
 * @desc    Reset character stats
 * @access  Private
 */
router.post('/:characterId/stats/reset', (req, res) => characterStatsController.resetStats(req, res));

/**
 * @route   GET /api/characters/:characterId/stats/reset-cost
 * @desc    Get cost to reset stats
 * @access  Private
 */
router.get('/:characterId/stats/reset-cost', (req, res) => characterStatsController.getResetCost(req, res));

export default router;
