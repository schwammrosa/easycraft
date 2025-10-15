import { PrismaClient } from '@prisma/client';
import { 
  CreateListingDTO, 
  BuyListingDTO, 
  MarketplaceFilters, 
  MarketplaceResponse,
  MarketplaceListingWithDetails 
} from './marketplace.types';
import { logger } from '../../config/logger';

const prisma = new PrismaClient();

const COMMISSION_RATE = 0.05; // 5% commission
const LISTING_DURATION_DAYS = 7;

export class MarketplaceService {
  async getListings(filters: MarketplaceFilters): Promise<MarketplaceResponse> {
    const {
      search,
      type,
      minPrice,
      maxPrice,
      sortBy = 'newest',
      page = 1,
      limit = 20,
    } = filters;

    // Build where clause
    const where: any = {
      status: 'active',
      expiresAt: { gte: new Date() },
    };

    if (search) {
      where.item = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (type) {
      where.item = { ...where.item, type };
    }

    if (minPrice !== undefined) {
      where.pricePerUnit = { ...where.pricePerUnit, gte: minPrice };
    }

    if (maxPrice !== undefined) {
      where.pricePerUnit = { ...where.pricePerUnit, lte: maxPrice };
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { pricePerUnit: 'asc' };
        break;
      case 'price_desc':
        orderBy = { pricePerUnit: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Get total count
    const total = await prisma.marketplaceListing.count({ where });

    // Get listings
    const listings = await prisma.marketplaceListing.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        item: true,
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      listings: listings as MarketplaceListingWithDetails[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createListing(characterId: number, data: CreateListingDTO): Promise<MarketplaceListingWithDetails> {
    const { inventoryId, quantity, pricePerUnit } = data;

    logger.info(`Creating listing: characterId=${characterId}, inventoryId=${inventoryId}, quantity=${quantity}, price=${pricePerUnit}`);

    // Get inventory item
    const inventoryItem = await prisma.inventory.findFirst({
      where: {
        id: inventoryId,
        characterId,
      },
      include: { item: true },
    });

    if (!inventoryItem) {
      throw new Error('Item não encontrado no inventário');
    }

    // Check if item is tradeable
    if (!inventoryItem.item.isTradeable) {
      throw new Error('Este item não pode ser vendido');
    }

    // Check quantity
    if (quantity > inventoryItem.quantity) {
      throw new Error('Quantidade insuficiente');
    }

    if (quantity <= 0) {
      throw new Error('Quantidade inválida');
    }

    // Check price
    if (pricePerUnit <= 0) {
      throw new Error('Preço inválido');
    }

    // Calculate total and commission
    const totalPrice = pricePerUnit * quantity;
    const commission = Math.floor(totalPrice * COMMISSION_RATE);

    // Create listing and update inventory in transaction
    const listing = await prisma.$transaction(async (tx) => {
      // Remove items from inventory
      if (inventoryItem.quantity === quantity) {
        await tx.inventory.delete({ where: { id: inventoryItem.id } });
      } else {
        await tx.inventory.update({
          where: { id: inventoryItem.id },
          data: { quantity: inventoryItem.quantity - quantity },
        });
      }

      // Create listing
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + LISTING_DURATION_DAYS);

      return await tx.marketplaceListing.create({
        data: {
          sellerId: characterId,
          itemId: inventoryItem.item.id,
          quantity,
          pricePerUnit,
          totalPrice,
          commission,
          expiresAt,
        },
        include: {
          item: true,
          seller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    logger.info(`Listing created: id=${listing.id}`);

    return listing as MarketplaceListingWithDetails;
  }

  async buyListing(characterId: number, data: BuyListingDTO): Promise<void> {
    const { listingId, quantity } = data;

    logger.info(`Buying listing: characterId=${characterId}, listingId=${listingId}, quantity=${quantity}`);

    // Get listing
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: listingId },
      include: { item: true },
    });

    if (!listing) {
      throw new Error('Anúncio não encontrado');
    }

    if (listing.status !== 'active') {
      throw new Error('Este anúncio não está mais disponível');
    }

    if (listing.expiresAt < new Date()) {
      throw new Error('Este anúncio expirou');
    }

    if (listing.sellerId === characterId) {
      throw new Error('Você não pode comprar seu próprio anúncio');
    }

    // Validate quantity
    if (quantity <= 0 || quantity > listing.quantity) {
      throw new Error('Quantidade inválida');
    }

    // Get buyer character
    const buyer = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!buyer) {
      throw new Error('Personagem não encontrado');
    }

    // Calculate price for requested quantity
    const totalPrice = listing.pricePerUnit * quantity;
    const commission = Math.floor(totalPrice * COMMISSION_RATE);

    // Check if buyer has enough gold
    if (buyer.gold < totalPrice) {
      throw new Error('Gold insuficiente');
    }

    // Execute transaction
    await prisma.$transaction(async (tx) => {
      // Permitimos comprar duplicatas mesmo para itens não empilháveis.
      // maxStack será respeitado apenas na lógica de equipar, não na compra.
      // If buying all items, mark as sold
      if (quantity === listing.quantity) {
        await tx.marketplaceListing.update({
          where: { id: listingId },
          data: {
            status: 'sold',
            buyerId: characterId,
            soldAt: new Date(),
          },
        });
      } else {
        // Partial purchase: reduce quantity from original listing
        await tx.marketplaceListing.update({
          where: { id: listingId },
          data: {
            quantity: listing.quantity - quantity,
            totalPrice: listing.pricePerUnit * (listing.quantity - quantity),
            commission: Math.floor(listing.pricePerUnit * (listing.quantity - quantity) * COMMISSION_RATE),
          },
        });
      }

      // Transfer gold (buyer -> seller, minus commission)
      await tx.character.update({
        where: { id: characterId },
        data: { gold: { decrement: totalPrice } },
      });

      const sellerReceives = totalPrice - commission;
      await tx.character.update({
        where: { id: listing.sellerId },
        data: { gold: { increment: sellerReceives } },
      });

      // Give item to buyer – atomic upsert avoids unique constraint and race conditions
      await tx.inventory.upsert({
        where: { characterId_itemId: { characterId, itemId: listing.itemId } },
        update: { quantity: { increment: quantity } },
        create: { characterId, itemId: listing.itemId, quantity },
      });

      await tx.marketplaceTransaction.create({
        data: {
          listingId,
          sellerId: listing.sellerId,
          buyerId: characterId,
          itemId: listing.itemId,
          quantity,
          pricePerUnit: listing.pricePerUnit,
          totalPrice,
          commission,
        },
      });
    });

    logger.info(`Listing purchased: id=${listingId}, quantity=${quantity} by character ${characterId}`);
  }

  async cancelListing(characterId: number, listingId: number): Promise<void> {
    logger.info(`Cancelling listing: characterId=${characterId}, listingId=${listingId}`);

    // Get listing
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new Error('Anúncio não encontrado');
    }

    if (listing.sellerId !== characterId) {
      throw new Error('Você não pode cancelar este anúncio');
    }

    if (listing.status !== 'active') {
      throw new Error('Este anúncio não pode ser cancelado');
    }

    // Cancel listing and return items
    await prisma.$transaction(async (tx) => {
      // Update listing status
      await tx.marketplaceListing.update({
        where: { id: listingId },
        data: { status: 'cancelled' },
      });

      // Return items to seller – atomic upsert avoids unique constraint and race conditions
      await tx.inventory.upsert({
        where: { characterId_itemId: { characterId, itemId: listing.itemId } },
        update: { quantity: { increment: listing.quantity } },
        create: { characterId, itemId: listing.itemId, quantity: listing.quantity },
      });
    });

    logger.info(`Listing cancelled: id=${listingId}`);
  }

  async getMyListings(characterId: number): Promise<MarketplaceListingWithDetails[]> {
    const listings = await prisma.marketplaceListing.findMany({
      where: {
        sellerId: characterId,
        status: { in: ['active', 'sold'] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        item: true,
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return listings as MarketplaceListingWithDetails[];
  }

  async getHistory(characterId: number, type: 'purchases' | 'sales', page = 1, limit = 20) {
    const where = type === 'purchases' ? { buyerId: characterId } : { sellerId: characterId };

    const total = await prisma.marketplaceTransaction.count({ where });

    const transactions = await prisma.marketplaceTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        item: true,
        listing: { select: { id: true } },
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    return { transactions, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const marketplaceService = new MarketplaceService();
