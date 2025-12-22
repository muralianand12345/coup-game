import { create } from 'zustand';

interface OnlineStore {
	onlineCount: number;
	setOnlineCount: (count: number) => void;
}

export const useOnlineStore = create<OnlineStore>((set) => ({
	onlineCount: 0,
	setOnlineCount: (count) => set({ onlineCount: count }),
}));
