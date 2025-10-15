import { create } from 'zustand';
import { Character } from '../types';

interface CharacterState {
  characters: Character[];
  selectedCharacter: Character | null;
  setCharacters: (characters: Character[]) => void;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: number) => void;
  selectCharacter: (character: Character | null) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  characters: [],
  selectedCharacter: null,
  
  setCharacters: (characters) => set({ characters }),
  
  addCharacter: (character) =>
    set((state) => ({ characters: [...state.characters, character] })),
  
  removeCharacter: (id) =>
    set((state) => ({
      characters: state.characters.filter((c) => c.id !== id),
      selectedCharacter: state.selectedCharacter?.id === id ? null : state.selectedCharacter,
    })),
  
  selectCharacter: (character) => set({ selectedCharacter: character }),
}));
