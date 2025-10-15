import { Router } from 'express';
import { questController } from './quest.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/quest/:characterId/available
 * @desc    Get available quests for character
 * @access  Private
 */
router.get('/:characterId/available', (req, res) => questController.getAvailableQuests(req, res));

/**
 * @route   GET /api/quest/:characterId/active
 * @desc    Get active quests for character
 * @access  Private
 */
router.get('/:characterId/active', (req, res) => questController.getActiveQuests(req, res));

/**
 * @route   POST /api/quest/:characterId/accept
 * @desc    Accept a quest
 * @access  Private
 */
router.post('/:characterId/accept', (req, res) => questController.acceptQuest(req, res));

/**
 * @route   POST /api/quest/:characterId/claim
 * @desc    Claim quest rewards
 * @access  Private
 */
router.post('/:characterId/claim', (req, res) => questController.claimQuest(req, res));

export default router;
