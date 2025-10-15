import { Router } from 'express';
import { marketplaceController } from './marketplace.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/marketplace
 * @desc    Get all active listings with filters
 * @access  Private
 * @query   search, type, minPrice, maxPrice, sortBy, page, limit
 */
router.get('/', (req, res) => marketplaceController.getListings(req, res));

/**
 * @route   GET /api/marketplace/my/:characterId
 * @desc    Get character's listings (active and sold)
 * @access  Private
 */
router.get('/my/:characterId', (req, res) => marketplaceController.getMyListings(req, res));

/**
 * @route   POST /api/marketplace/:characterId/create
 * @desc    Create a new listing
 * @access  Private
 * @body    { inventoryId, quantity, pricePerUnit }
 */
router.post('/:characterId/create', (req, res) => marketplaceController.createListing(req, res));

/**
 * @route   POST /api/marketplace/:characterId/buy
 * @desc    Buy a listing
 * @access  Private
 * @body    { listingId }
 */
router.post('/:characterId/buy', (req, res) => marketplaceController.buyListing(req, res));

/**
 * @route   DELETE /api/marketplace/:characterId/:listingId
 * @desc    Cancel a listing
 * @access  Private
 */
router.delete('/:characterId/:listingId', (req, res) => marketplaceController.cancelListing(req, res));

export default router;
