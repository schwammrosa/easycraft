import { Router } from 'express';
import { characterController } from './character.controller';
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
 * @route   DELETE /api/characters/:id
 * @desc    Delete character
 * @access  Private
 */
router.delete('/:id', (req, res) => characterController.deleteCharacter(req, res));

export default router;
