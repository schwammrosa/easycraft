import { MarketplaceListing, Item, Character, MarketplaceStatus } from '@prisma/client';

export interface MarketplaceListingWithDetails extends MarketplaceListing {
  item: Item;
  seller: {
    id: number;
    name: string;
  };
}

export interface CreateListingDTO {
  inventoryId: number;
  quantity: number;
  pricePerUnit: number;
}

export interface BuyListingDTO {
  listingId: number;
  quantity: number;
}

export interface MarketplaceFilters {
  search?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface MarketplaceResponse {
  listings: MarketplaceListingWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}
