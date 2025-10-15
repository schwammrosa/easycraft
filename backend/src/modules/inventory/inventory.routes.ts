import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/inventory/:characterId
 * @desc    Get character inventory
 * @access  Private
 */
router.get('/:characterId', (req, res) => inventoryController.getInventory(req, res));

/**
 * @route   GET /api/inventory/:characterId/equipment
 * @desc    Get character equipment
 * @access  Private
 */
router.get('/:characterId/equipment', (req, res) => inventoryController.getEquipment(req, res));

/**
 * @route   POST /api/inventory/:characterId/equip
 * @desc    Equip an item
 * @access  Private
 */
router.post('/:characterId/equip', (req, res) => inventoryController.equipItem(req, res));

/**
 * @route   POST /api/inventory/:characterId/unequip
 * @desc    Unequip an item
 * @access  Private
 */
router.post('/:characterId/unequip', (req, res) => inventoryController.unequipItem(req, res));

export default router;
