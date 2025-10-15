import { api } from './api';
import { ApiResponse, Character, CreateCharacterDTO } from '../types';

export const characterService = {
  async getCharacters(): Promise<Character[]> {
    const response = await api.get<ApiResponse<{ characters: Character[] }>>('/characters');
    return response.data.data!.characters;
  },

  async getCharacter(id: number): Promise<Character> {
    const response = await api.get<ApiResponse<{ character: Character }>>(`/characters/${id}`);
    return response.data.data!.character;
  },

  async createCharacter(data: CreateCharacterDTO): Promise<Character> {
    const response = await api.post<ApiResponse<{ character: Character }>>('/characters', data);
    return response.data.data!.character;
  },

  async deleteCharacter(id: number): Promise<void> {
    await api.delete(`/characters/${id}`);
  },
};
