import { create } from 'zustand';
import { Room, GameState, ChatMessage, Player } from '@coup/shared';

interface GameStore {
  playerId: string | null;
  room: Room | null;
  gameState: GameState | null;
  chatMessages: ChatMessage[];
  timer: number;
  error: string | null;
  
  setPlayerId: (id: string | null) => void;
  setRoom: (room: Room | null) => void;
  setGameState: (state: GameState | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  setTimer: (seconds: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  getCurrentPlayer: () => Player | null;
  getMyPlayer: () => Player | null;
  isMyTurn: () => boolean;
}

const initialState = {
  playerId: null,
  room: null,
  gameState: null,
  chatMessages: [],
  timer: 0,
  error: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  
  setPlayerId: (id) => set({ playerId: id }),
  setRoom: (room) => set({ room }),
  setGameState: (gameState) => set({ gameState }),
  addChatMessage: (message) => set((state) => ({ 
    chatMessages: [...state.chatMessages.slice(-99), message] 
  })),
  setTimer: (timer) => set({ timer }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
  
  getCurrentPlayer: () => {
    const { gameState } = get();
    if (!gameState) return null;
    return gameState.players[gameState.currentPlayerIndex];
  },
  
  getMyPlayer: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId) return null;
    return gameState.players.find(p => p.id === playerId) || null;
  },
  
  isMyTurn: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId) return false;
    return gameState.players[gameState.currentPlayerIndex].id === playerId;
  },
}));
