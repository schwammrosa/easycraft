import { Router } from 'express';
import { itemController } from './item.controller';

const router = Router();

/**
 * @route   GET /api/items
 * @desc    Get all items
 * @access  Public
 */
router.get('/', (req, res) => itemController.getAllItems(req, res));

/**
 * @route   GET /api/items/:id
 * @desc    Get item by ID
 * @access  Public
 */
router.get('/:id', (req, res) => itemController.getItem(req, res));

export default router;
