import { Router } from 'express';
import { gatheringController } from './gathering.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

/**
 * @route   GET /api/gathering/:characterId/nodes
 * @desc    Get available gather nodes for character level
 * @access  Private
 */
router.get('/:characterId/nodes', authenticate, (req, res) =>
  gatheringController.getGatherNodes(req, res)
);

/**
 * @route   POST /api/gathering/:characterId/start
 * @desc    Start a gather session (async)
 * @access  Private
 */
router.post('/:characterId/start', authenticate, (req, res) =>
  gatheringController.startGatherSession(req, res)
);

/**
 * @route   GET /api/gathering/session/:sessionId
 * @desc    Get gather session status
 * @access  Private
 */
router.get('/session/:sessionId', authenticate, (req, res) =>
  gatheringController.getGatherSessionStatus(req, res)
);

/**
 * @route   POST /api/gathering/:characterId/session/:sessionId/cancel
 * @desc    Cancel an active gather session
 * @access  Private
 */
router.post('/:characterId/session/:sessionId/cancel', authenticate, (req, res) =>
  gatheringController.cancelGatherSession(req, res)
);

/**
 * @route   GET /api/gathering/:characterId/history
 * @desc    Get gather history for character
 * @access  Private
 */
router.get('/:characterId/history', authenticate, (req, res) =>
  gatheringController.getGatherHistory(req, res)
);

/**
 * @route   GET /api/gathering/:characterId/active
 * @desc    Get active gather session for character
 * @access  Private
 */
router.get('/:characterId/active', authenticate, (req, res) =>
  gatheringController.getActiveGatherSession(req, res)
);

export default router;
