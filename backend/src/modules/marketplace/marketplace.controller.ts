import { Request, Response } from 'express';
import { marketplaceService } from './marketplace.service';
import { logger } from '../../config/logger';

export class MarketplaceController {
  async getListings(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string,
        type: req.query.type as string,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        sortBy: req.query.sortBy as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      const result = await marketplaceService.getListings(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Get marketplace listings error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar anúncios',
        },
      });
    }
  }

  async createListing(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);

      if (isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID do personagem inválido',
          },
        });
        return;
      }

      const listing = await marketplaceService.createListing(characterId, req.body);

      logger.info(`Listing created by character ${characterId}`);

      res.json({
        success: true,
        data: { listing },
      });
    } catch (error) {
      logger.error('Create listing error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'CREATE_LISTING_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao criar anúncio',
        },
      });
    }
  }

  async buyListing(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);

      if (isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID do personagem inválido',
          },
        });
        return;
      }

      await marketplaceService.buyListing(characterId, req.body);

      logger.info(`Listing purchased by character ${characterId}`);

      res.json({
        success: true,
        message: 'Item comprado com sucesso!',
      });
    } catch (error) {
      logger.error('Buy listing error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'BUY_LISTING_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao comprar item',
        },
      });
    }
  }

  async cancelListing(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);
      const listingId = parseInt(req.params.listingId);

      if (isNaN(characterId) || isNaN(listingId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'IDs inválidos',
          },
        });
        return;
      }

      await marketplaceService.cancelListing(characterId, listingId);

      logger.info(`Listing ${listingId} cancelled by character ${characterId}`);

      res.json({
        success: true,
        message: 'Anúncio cancelado com sucesso!',
      });
    } catch (error) {
      logger.error('Cancel listing error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'CANCEL_LISTING_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao cancelar anúncio',
        },
      });
    }
  }

  async getMyListings(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);

      if (isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID do personagem inválido',
          },
        });
        return;
      }

      const listings = await marketplaceService.getMyListings(characterId);

      res.json({
        success: true,
        data: { listings },
      });
    } catch (error) {
      logger.error('Get my listings error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar seus anúncios',
        },
      });
    }
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);
      const type = (req.query.type as 'purchases' | 'sales') || 'purchases';
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      if (isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_ID', message: 'ID do personagem inválido' },
        });
        return;
      }

      const data = await marketplaceService.getHistory(characterId, type, page, limit);

      res.json({ success: true, data });
    } catch (error) {
      logger.error('Get marketplace history error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Erro ao buscar histórico' },
      });
    }
  }
}

export const marketplaceController = new MarketplaceController();
