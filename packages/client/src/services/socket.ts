import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@coup/shared';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: TypedSocket | null = null;

export const getSocket = (): TypedSocket => {
	if (!socket) socket = io(SERVER_URL, { autoConnect: false, reconnection: true, reconnectionAttempts: 5, reconnectionDelay: 1000 });
	return socket;
};

export const connectSocket = (): void => {
	const s = getSocket();
	if (!s.connected) s.connect();
};

export const disconnectSocket = (): void => {
	if (socket?.connected) socket.disconnect();
};

export const getServerUrl = (): string => SERVER_URL;

export const fetchOnlineCount = async (): Promise<number> => {
	try {
		const response = await fetch(`${SERVER_URL}/stats`, { signal: AbortSignal.timeout(5000) });
		if (response.ok) {
			const data = await response.json();
			return data.onlineCount || 0;
		}
	} catch {
		return 0;
	}
	return 0;
};

export const wakeUpServer = async (onStatusChange?: (status: string) => void): Promise<boolean> => {
	const maxRetries = 5;
	const baseDelay = 2000;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			onStatusChange?.(attempt === 1 ? 'Connecting to server...' : `Server is waking up... (attempt ${attempt}/${maxRetries})`);

			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);
			const response = await fetch(`${SERVER_URL}/health`, { signal: controller.signal });

			clearTimeout(timeoutId);

			if (response.ok) {
				onStatusChange?.('Server is ready!');
				return true;
			}
		} catch (error) {
			if (attempt === maxRetries) {
				onStatusChange?.('Failed to connect to server');
				return false;
			}

			const delay = baseDelay * Math.pow(1.5, attempt - 1);
			onStatusChange?.(`Server is starting up... retrying in ${Math.round(delay / 1000)}s (attempt ${attempt}/${maxRetries})`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	return false;
};

export const waitForSocketConnection = (timeoutMs: number = 10000): Promise<boolean> => {
	return new Promise((resolve) => {
		const s = getSocket();

		if (s.connected) {
			resolve(true);
			return;
		}

		const timeout = setTimeout(() => {
			s.off('connect', onConnect);
			s.off('connect_error', onError);
			resolve(false);
		}, timeoutMs);

		const onConnect = () => {
			clearTimeout(timeout);
			s.off('connect_error', onError);
			resolve(true);
		};

		const onError = () => {
			clearTimeout(timeout);
			s.off('connect', onConnect);
			resolve(false);
		};

		s.once('connect', onConnect);
		s.once('connect_error', onError);

		if (!s.connected) s.connect();
	});
};
