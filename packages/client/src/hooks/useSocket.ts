import { useEffect, useCallback } from 'react';
import { getSocket, connectSocket } from '../services/socket';
import { useGameStore } from '../store/gameStore';
import { ActionType, CardType } from '@coup/shared';

const SESSION_STORAGE_KEY = 'coup_session';

interface SessionData {
	playerId: string;
	roomId: string;
}

const saveSession = (playerId: string, roomId: string): void => {
	sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ playerId, roomId }));
};

const getSession = (): SessionData | null => {
	const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
	return data ? JSON.parse(data) : null;
};

const clearSession = (): void => {
	sessionStorage.removeItem(SESSION_STORAGE_KEY);
};

export const useSocket = () => {
	const { setPlayerId, setRoom, setGameState, addChatMessage, setTimer, setError, reset } = useGameStore();

	useEffect(() => {
		connectSocket();
		const socket = getSocket();

		socket.on('roomUpdate', (room) => {
			setRoom(room);
		});

		socket.on('gameStateUpdate', (state) => {
			setGameState(state);
		});

		socket.on('chatMessage', (message) => {
			addChatMessage(message);
		});

		socket.on('timerUpdate', (seconds) => {
			setTimer(seconds);
		});

		socket.on('error', (message) => {
			setError(message);
		});

		socket.on('playerDisconnected', (playerId) => {
			console.log('Player disconnected:', playerId);
		});

		socket.on('playerReconnected', (playerId) => {
			console.log('Player reconnected:', playerId);
		});

		// Attempt to rejoin when socket connects (including reconnections)
		const attemptRejoin = () => {
			const session = getSession();
			if (session) {
				console.log('Attempting to rejoin room:', session.roomId);
				socket.emit('rejoinRoom', session.roomId, session.playerId, (response) => {
					if (response.success && response.playerId) {
						console.log('Rejoin successful');
						setPlayerId(response.playerId);
						setRoom(response.room || null);
					} else {
						console.log('Rejoin failed:', response.error);
						clearSession();
					}
				});
			}
		};

		// Try to rejoin on initial connect
		socket.on('connect', () => {
			console.log('Socket connected');
			attemptRejoin();
		});

		// If already connected when this effect runs, attempt rejoin immediately
		if (socket.connected) {
			attemptRejoin();
		}

		return () => {
			socket.off('roomUpdate');
			socket.off('gameStateUpdate');
			socket.off('chatMessage');
			socket.off('timerUpdate');
			socket.off('error');
			socket.off('playerDisconnected');
			socket.off('playerReconnected');
			socket.off('connect');
		};
	}, [setPlayerId, setRoom, setGameState, addChatMessage, setTimer, setError]);

	const createRoom = useCallback(
		(playerName: string): Promise<boolean> => {
			return new Promise((resolve) => {
				const socket = getSocket();
				socket.emit('createRoom', playerName, (response) => {
					if (response.success && response.playerId && response.room) {
						setPlayerId(response.playerId);
						setRoom(response.room);
						saveSession(response.playerId, response.room.id);
						resolve(true);
					} else {
						setError(response.error || 'Failed to create room');
						resolve(false);
					}
				});
			});
		},
		[setPlayerId, setRoom, setError]
	);

	const joinRoom = useCallback(
		(roomId: string, playerName: string): Promise<boolean> => {
			return new Promise((resolve) => {
				const socket = getSocket();
				socket.emit('joinRoom', roomId, playerName, (response) => {
					if (response.success && response.playerId && response.room) {
						setPlayerId(response.playerId);
						setRoom(response.room);
						saveSession(response.playerId, response.room.id);
						resolve(true);
					} else {
						setError(response.error || 'Failed to join room');
						resolve(false);
					}
				});
			});
		},
		[setPlayerId, setRoom, setError]
	);

	const leaveRoom = useCallback(() => {
		const socket = getSocket();
		socket.emit('leaveRoom');
		clearSession();
		reset();
	}, [reset]);

	const toggleReady = useCallback(() => {
		const socket = getSocket();
		socket.emit('toggleReady');
	}, []);

	const startGame = useCallback(() => {
		const socket = getSocket();
		socket.emit('startGame');
	}, []);

	const performAction = useCallback((action: ActionType, targetId?: string) => {
		const socket = getSocket();
		socket.emit('performAction', action, targetId);
	}, []);

	const challenge = useCallback(() => {
		const socket = getSocket();
		socket.emit('challenge');
	}, []);

	const passChallenge = useCallback(() => {
		const socket = getSocket();
		socket.emit('passChallenge');
	}, []);

	const block = useCallback((cardType: CardType) => {
		const socket = getSocket();
		socket.emit('block', cardType);
	}, []);

	const passBlock = useCallback(() => {
		const socket = getSocket();
		socket.emit('passBlock');
	}, []);

	const loseInfluence = useCallback((cardId: string) => {
		const socket = getSocket();
		socket.emit('loseInfluence', cardId);
	}, []);

	const selectExchangeCards = useCallback((keepCardIds: string[]) => {
		const socket = getSocket();
		socket.emit('selectExchangeCards', keepCardIds);
	}, []);

	const sendChat = useCallback((message: string) => {
		const socket = getSocket();
		socket.emit('sendChat', message);
	}, []);

	return {
		createRoom,
		joinRoom,
		leaveRoom,
		toggleReady,
		startGame,
		performAction,
		challenge,
		passChallenge,
		block,
		passBlock,
		loseInfluence,
		selectExchangeCards,
		sendChat,
	};
};
