import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, GamePhase, ActionType, CardType, ACTION_CONFIG, ChatMessage } from '@coup/shared';
import * as GameEngine from '../game/engine';
import { generateId } from '../utils/helpers';
import * as RoomManager from '../room/manager';
import { startTimer, stopTimer } from '../game/timer';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const passedPlayers: Map<string, Set<string>> = new Map();

const getPassedPlayers = (roomId: string): Set<string> => {
	if (!passedPlayers.has(roomId)) passedPlayers.set(roomId, new Set());
	return passedPlayers.get(roomId)!;
};

const clearPassedPlayers = (roomId: string): void => {
	passedPlayers.set(roomId, new Set());
};

const broadcastGameState = (io: TypedServer, roomId: string): void => {
	const room = RoomManager.getRoom(roomId);
	if (!room || !room.gameState) return;

	const passed = Array.from(getPassedPlayers(roomId));

	room.players.forEach((player) => {
		const socketId = RoomManager.getSocketIdByPlayerId(player.id);
		if (socketId) {
			const publicState = GameEngine.getPublicGameState(room.gameState!, player.id);
			(publicState as any).passedPlayers = passed;
			io.to(socketId).emit('gameStateUpdate', publicState);
		}
	});
};

const checkAllPlayersPassed = (io: TypedServer, roomId: string): boolean => {
	const room = RoomManager.getRoom(roomId);
	if (!room || !room.gameState) return false;

	const state = room.gameState;
	const passed = getPassedPlayers(roomId);

	const relevantPlayers = state.players.filter((p) => {
		if (!p.isAlive) return false;
		if (state.pendingAction && p.id === state.pendingAction.playerId) return false;
		if (state.pendingBlock && p.id === state.pendingBlock.playerId) return false;
		return true;
	});

	return relevantPlayers.every((p) => passed.has(p.id));
};

const handleAllPassed = (io: TypedServer, roomId: string): void => {
	const room = RoomManager.getRoom(roomId);
	if (!room || !room.gameState) return;

	const state = room.gameState;
	stopTimer(roomId);
	clearPassedPlayers(roomId);

	if (state.phase === GamePhase.ACTION_RESPONSE) {
		GameEngine.executeAction(state);
		RoomManager.updateGameState(roomId, state);
		broadcastGameState(io, roomId);
	} else if (state.phase === GamePhase.BLOCK_RESPONSE) {
		GameEngine.addLogEntry(state, 'Block successful - action canceled', 'block');
		GameEngine.advanceTurn(state);
		RoomManager.updateGameState(roomId, state);
		broadcastGameState(io, roomId);
	}
};

const checkForWinnerAfterDisconnect = (io: TypedServer, room: ReturnType<typeof RoomManager.getRoom>): void => {
	if (!room || !room.gameState) return;

	const state = room.gameState;
	GameEngine.checkForWinner(state);

	if (state.phase === GamePhase.GAME_OVER) {
		stopTimer(room.id);
		clearPassedPlayers(room.id);
	}

	RoomManager.updateGameState(room.id, state);
	broadcastGameState(io, room.id);
};

export const setupSocketHandlers = (io: TypedServer): void => {
	io.on('connection', (socket: TypedSocket) => {
		console.log(`Client connected: ${socket.id}`);

		socket.on('createRoom', (playerName, callback) => {
			const { room, playerId } = RoomManager.createRoom(playerName, socket.id);
			socket.join(room.id);
			callback({ success: true, room, playerId });
		});

		socket.on('joinRoom', (roomId, playerName, callback) => {
			const result = RoomManager.joinRoom(roomId.toUpperCase(), playerName, socket.id);
			if (result) {
				socket.join(roomId.toUpperCase());
				callback({ success: true, room: result.room, playerId: result.playerId });
				socket.to(roomId.toUpperCase()).emit('roomUpdate', result.room);
			} else {
				callback({ success: false, error: 'Unable to join room' });
			}
		});

		socket.on('leaveRoom', () => {
			const { room, playerId } = RoomManager.leaveRoom(socket.id);
			if (room && playerId) {
				socket.leave(room.id);
				io.to(room.id).emit('roomUpdate', room);
				if (room.isStarted && room.gameState) checkForWinnerAfterDisconnect(io, room);
			}
		});

		socket.on('toggleReady', () => {
			const room = RoomManager.togglePlayerReady(socket.id);
			if (room) io.to(room.id).emit('roomUpdate', room);
		});

		socket.on('startGame', () => {
			const result = RoomManager.startGame(socket.id);
			if (result) {
				io.to(result.room.id).emit('roomUpdate', result.room);
				broadcastGameState(io, result.room.id);
			}
		});

		socket.on('performAction', (action: ActionType, targetId?: string) => {
			const room = RoomManager.getRoomBySocketId(socket.id);
			const playerId = RoomManager.getPlayerIdBySocketId(socket.id);
			if (!room || !room.gameState || !playerId) return;

			const state = room.gameState;
			if (state.phase !== GamePhase.ACTION_SELECT) return;
			if (GameEngine.getCurrentPlayer(state).id !== playerId) return;
			if (!GameEngine.canPerformAction(state, playerId, action, targetId)) return;

			const player = GameEngine.getPlayerById(state, playerId)!;
			const config = ACTION_CONFIG[action];

			state.pendingAction = GameEngine.createPendingAction(action, playerId, targetId);

			if (config.targetRequired && targetId) {
				const target = GameEngine.getPlayerById(state, targetId);
				GameEngine.addLogEntry(state, `${player.name} attempts ${action} on ${target?.name}`);
			} else {
				GameEngine.addLogEntry(state, `${player.name} attempts ${action}`);
			}

			if (!config.canBeBlocked && !config.canBeChallenged) {
				GameEngine.executeAction(state);
			} else {
				state.phase = GamePhase.ACTION_RESPONSE;
				clearPassedPlayers(room.id);
				startTimer(io, room.id, () => handleAllPassed(io, room.id));
			}

			RoomManager.updateGameState(room.id, state);
			broadcastGameState(io, room.id);
		});

		socket.on('challenge', () => {
			const room = RoomManager.getRoomBySocketId(socket.id);
			const playerId = RoomManager.getPlayerIdBySocketId(socket.id);
			if (!room || !room.gameState || !playerId) return;

			const state = room.gameState;
			stopTimer(room.id);
			clearPassedPlayers(room.id);

			if (state.phase === GamePhase.ACTION_RESPONSE && state.pendingAction?.canBeChallenged) {
				const challengeSuccess = GameEngine.handleChallenge(state, playerId, state.pendingAction.requiredCard!, state.pendingAction.playerId);
				if (challengeSuccess) state.pendingAction = null;
			} else if (state.phase === GamePhase.BLOCK_RESPONSE && state.pendingBlock) {
				const challengeSuccess = GameEngine.handleChallenge(state, playerId, state.pendingBlock.claimedCard, state.pendingBlock.playerId);

				// If the challenge against the block is successful, the blocker must
				// immediately lose influence. Keep the phase as CHALLENGE_RESOLUTION
				// (set inside handleChallenge) and clear the pending block. Do NOT
				// revert to ACTION_RESPONSE here, which caused a frozen timer and
				// incorrect UI state.
				if (challengeSuccess) {
					state.pendingBlock = null;
				}
			}

			RoomManager.updateGameState(room.id, state);
			broadcastGameState(io, room.id);
		});

		socket.on('passChallenge', () => {
			const room = RoomManager.getRoomBySocketId(socket.id);
			const playerId = RoomManager.getPlayerIdBySocketId(socket.id);
			if (!room || !room.gameState || !playerId) return;

			const state = room.gameState;
			if (state.phase !== GamePhase.ACTION_RESPONSE && state.phase !== GamePhase.BLOCK_RESPONSE) return;

			getPassedPlayers(room.id).add(playerId);

			if (checkAllPlayersPassed(io, room.id)) {
				handleAllPassed(io, room.id);
			} else {
				broadcastGameState(io, room.id);
			}
		});

		socket.on('block', (cardType: CardType) => {
			const room = RoomManager.getRoomBySocketId(socket.id);
			const playerId = RoomManager.getPlayerIdBySocketId(socket.id);
			if (!room || !room.gameState || !playerId) return;

			const state = room.gameState;
			if (state.phase !== GamePhase.ACTION_RESPONSE) return;
			if (!state.pendingAction?.canBeBlocked) return;
			if (!state.pendingAction.blockableBy.includes(cardType)) return;

			const action = state.pendingAction;
			if (action.targetRequired && action.targetId !== playerId) if (action.type !== ActionType.FOREIGN_AID) return;

			stopTimer(room.id);
			clearPassedPlayers(room.id);

			GameEngine.handleBlock(state, playerId, cardType);

			startTimer(io, room.id, () => handleAllPassed(io, room.id));

			RoomManager.updateGameState(room.id, state);
			broadcastGameState(io, room.id);
		});

		socket.on('passBlock', () => {
			const room = RoomManager.getRoomBySocketId(socket.id);
			const playerId = RoomManager.getPlayerIdBySocketId(socket.id);
			if (!room || !room.gameState || !playerId) return;

			const state = room.gameState;
			if (state.phase !== GamePhase.BLOCK_RESPONSE) return;

			getPassedPlayers(room.id).add(playerId);

			if (checkAllPlayersPassed(io, room.id)) handleAllPassed(io, room.id);
		});

		socket.on('loseInfluence', (cardId: string) => {
			const room = RoomManager.getRoomBySocketId(socket.id);
			const playerId = RoomManager.getPlayerIdBySocketId(socket.id);
			if (!room || !room.gameState || !playerId) return;

			const state = room.gameState;
			if (state.phase !== GamePhase.LOSE_INFLUENCE && state.phase !== GamePhase.CHALLENGE_RESOLUTION) return;
			if (state.playerLosingInfluence !== playerId) return;

			GameEngine.playerLosesInfluence(state, playerId, cardId);

			if (!state.winner) {
				if (state.phase === GamePhase.CHALLENGE_RESOLUTION) {
					if (state.pendingAction && state.challengerId === playerId) {
						GameEngine.executeAction(state);
					} else if (state.pendingBlock && state.challengerId === playerId) {
						GameEngine.addLogEntry(state, 'Block successful - action canceled', 'block');
						GameEngine.advanceTurn(state);
					} else if (state.pendingAction && !state.pendingBlock) {
						GameEngine.executeAction(state);
					} else {
						state.pendingAction = null;
						state.pendingBlock = null;
						GameEngine.advanceTurn(state);
					}
				} else {
					GameEngine.advanceTurn(state);
				}
			}

			RoomManager.updateGameState(room.id, state);
			broadcastGameState(io, room.id);
		});

		socket.on('selectExchangeCards', (keepCardIds: string[]) => {
			const room = RoomManager.getRoomBySocketId(socket.id);
			const playerId = RoomManager.getPlayerIdBySocketId(socket.id);
			if (!room || !room.gameState || !playerId) return;

			const state = room.gameState;
			if (state.phase !== GamePhase.EXCHANGE_SELECT) return;
			if (GameEngine.getCurrentPlayer(state).id !== playerId) return;

			GameEngine.completeExchange(state, playerId, keepCardIds);

			RoomManager.updateGameState(room.id, state);
			broadcastGameState(io, room.id);
		});

		socket.on('sendChat', (message: string) => {
			const room = RoomManager.getRoomBySocketId(socket.id);
			const playerId = RoomManager.getPlayerIdBySocketId(socket.id);
			if (!room || !playerId) return;

			const player = room.players.find((p) => p.id === playerId);
			if (!player) return;

			const chatMessage: ChatMessage = {
				id: generateId(),
				playerId,
				playerName: player.name,
				message: message.slice(0, 200),
				timestamp: Date.now(),
			};

			io.to(room.id).emit('chatMessage', chatMessage);
		});

		socket.on('disconnect', () => {
			console.log(`Client disconnected: ${socket.id}`);
			const { room, playerId } = RoomManager.leaveRoom(socket.id);
			if (room && playerId) {
				io.to(room.id).emit('roomUpdate', room);
				if (room.isStarted && room.gameState) checkForWinnerAfterDisconnect(io, room);
			}
		});
	});
};
