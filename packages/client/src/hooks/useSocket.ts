import { useEffect, useCallback } from 'react';
import { ActionType, CardType } from '@coup/shared';
import { useGameStore } from '../store/gameStore';
import { getSocket, connectSocket, wakeUpServer, waitForSocketConnection } from '../services/socket';

export const useSocket = () => {
	const { setPlayerId, setRoom, setGameState, addChatMessage, setTimer, setError, reset } = useGameStore();

	useEffect(() => {
		connectSocket();
		const socket = getSocket();

		socket.on('roomUpdate', (room) => setRoom(room));
		socket.on('gameStateUpdate', (state) => setGameState(state));
		socket.on('chatMessage', (message) => addChatMessage(message));
		socket.on('timerUpdate', (seconds) => setTimer(seconds));
		socket.on('error', (message) => setError(message));
		socket.on('playerDisconnected', (playerId) => console.log('Player disconnected:', playerId));

		return () => {
			socket.off('roomUpdate');
			socket.off('gameStateUpdate');
			socket.off('chatMessage');
			socket.off('timerUpdate');
			socket.off('error');
			socket.off('playerDisconnected');
		};
	}, [setPlayerId, setRoom, setGameState, addChatMessage, setTimer, setError]);

	const ensureConnection = useCallback(async (onStatusChange?: (status: string) => void): Promise<boolean> => {
		const socket = getSocket();

		if (socket.connected) return true;

		const serverAwake = await wakeUpServer(onStatusChange);
		if (!serverAwake) return false;

		onStatusChange?.('Establishing connection...');
		const connected = await waitForSocketConnection(10000);

		if (!connected) {
			onStatusChange?.('Failed to establish connection');
			return false;
		}

		return true;
	}, []);

	const createRoom = useCallback(
		(playerName: string, onStatusChange?: (status: string) => void): Promise<boolean> => {
			return new Promise(async (resolve) => {
				const connected = await ensureConnection(onStatusChange);

				if (!connected) {
					setError('Could not connect to server. Please try again.');
					resolve(false);
					return;
				}

				onStatusChange?.('Creating room...');
				const socket = getSocket();

				const timeout = setTimeout(() => {
					setError('Request timed out. Please try again.');
					resolve(false);
				}, 15000);

				socket.emit('createRoom', playerName, (response) => {
					clearTimeout(timeout);
					if (response.success && response.playerId && response.room) {
						setPlayerId(response.playerId);
						setRoom(response.room);
						resolve(true);
					} else {
						setError(response.error || 'Failed to create room');
						resolve(false);
					}
				});
			});
		},
		[setPlayerId, setRoom, setError, ensureConnection]
	);

	const joinRoom = useCallback(
		(roomId: string, playerName: string, onStatusChange?: (status: string) => void): Promise<boolean> => {
			return new Promise(async (resolve) => {
				const connected = await ensureConnection(onStatusChange);

				if (!connected) {
					setError('Could not connect to server. Please try again.');
					resolve(false);
					return;
				}

				onStatusChange?.('Joining room...');
				const socket = getSocket();

				const timeout = setTimeout(() => {
					setError('Request timed out. Please try again.');
					resolve(false);
				}, 15000);

				socket.emit('joinRoom', roomId, playerName, (response) => {
					clearTimeout(timeout);
					if (response.success && response.playerId && response.room) {
						setPlayerId(response.playerId);
						setRoom(response.room);
						resolve(true);
					} else {
						setError(response.error || 'Failed to join room');
						resolve(false);
					}
				});
			});
		},
		[setPlayerId, setRoom, setError, ensureConnection]
	);

	const leaveRoom = useCallback(() => {
		const socket = getSocket();
		socket.emit('leaveRoom');
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
