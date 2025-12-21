import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => uuidv4();

export const generateRoomCode = (): string => {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let code = '';
	for (let i = 0; i < 5; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
};

export const shuffleArray = <T>(array: T[]): T[] => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
