import { api } from './api';
import { ApiResponse } from '../types';

export interface MarketplaceListing {
  id: number;
  sellerId: number;
  itemId: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  commission: number;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  buyerId?: number;
  createdAt: string;
  soldAt?: string;
  expiresAt: string;
  item: {
    id: number;
    code: string;
    name: string;
    description?: string;
    type: string;
    baseValue: number;
    imagePath?: string;
  };
  seller: {
    id: number;
    name: string;
  };
  buyer?: {
    id: number;
    name: string;
  };
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
  listings: MarketplaceListing[];
  total: number;
  page: number;
  totalPages: number;
}

export interface MarketplaceTransaction {
  id: number;
  listingId: number;
  sellerId: number;
  buyerId: number;
  itemId: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  commission: number;
  createdAt: string;
  item: {
    id: number;
    code: string;
    name: string;
    description?: string;
    type: string;
    baseValue: number;
    imagePath?: string;
  };
  listing: { id: number };
  buyer: { id: number; name: string };
  seller: { id: number; name: string };
}

export const marketplaceService = {
  async getListings(filters?: MarketplaceFilters): Promise<MarketplaceResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ApiResponse<MarketplaceResponse>>(`/marketplace?${params}`);
    return response.data.data!;
  },

  async createListing(characterId: number, data: {
    inventoryId: number;
    quantity: number;
    pricePerUnit: number;
  }): Promise<MarketplaceListing> {
    const response = await api.post<ApiResponse<{ listing: MarketplaceListing }>>(
      `/marketplace/${characterId}/create`,
      data
    );
    return response.data.data!.listing;
  },

  async buyListing(characterId: number, listingId: number, quantity: number): Promise<void> {
    await api.post(`/marketplace/${characterId}/buy`, { listingId, quantity });
  },

  async cancelListing(characterId: number, listingId: number): Promise<void> {
    await api.delete(`/marketplace/${characterId}/${listingId}`);
  },

  async getMyListings(characterId: number): Promise<MarketplaceListing[]> {
    const response = await api.get<ApiResponse<{ listings: MarketplaceListing[] }>>(
      `/marketplace/my/${characterId}`
    );
    return response.data.data!.listings;
  },

  async getHistory(
    characterId: number,
    type: 'purchases' | 'sales',
    page = 1,
    limit = 20
  ): Promise<{ transactions: MarketplaceTransaction[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams();
    params.set('type', type);
    params.set('page', String(page));
    params.set('limit', String(limit));
    const response = await api.get<ApiResponse<{ transactions: MarketplaceTransaction[]; total: number; page: number; totalPages: number }>>(
      `/marketplace/history/${characterId}?${params}`
    );
    return response.data.data!;
  },
};
