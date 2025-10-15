import { Router } from 'express';
import { craftingController } from './crafting.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/crafting/recipes
 * @desc    Get all crafting recipes
 * @access  Private
 */
router.get('/recipes', (req, res) => craftingController.getAllRecipes(req, res));

/**
 * @route   GET /api/crafting/:characterId/recipes
 * @desc    Get available recipes for character
 * @access  Private
 */
router.get('/:characterId/recipes', (req, res) => craftingController.getRecipes(req, res));

/**
 * @route   POST /api/crafting/:characterId/craft
 * @desc    Craft an item
 * @access  Private
 */
router.post('/:characterId/craft', (req, res) => craftingController.craftItem(req, res));

export default router;
