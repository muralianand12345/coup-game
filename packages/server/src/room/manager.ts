import { Room, GameState } from '@coup/shared';
import { generateId, generateRoomCode } from '../utils/helpers';
import { createPlayer, createInitialGameState } from '../game/engine';

interface RoomStore {
	rooms: Map<string, Room>;
	playerToRoom: Map<string, string>;
	socketToPlayer: Map<string, string>;
}

const store: RoomStore = {
	rooms: new Map(),
	playerToRoom: new Map(),
	socketToPlayer: new Map(),
};

export const createRoom = (hostName: string, socketId: string): { room: Room; playerId: string } => {
	const roomId = generateRoomCode();
	const playerId = generateId();
	const host = createPlayer(playerId, hostName);

	const room: Room = {
		id: roomId,
		hostId: playerId,
		players: [host],
		gameState: null,
		maxPlayers: 6,
		isStarted: false,
	};

	store.rooms.set(roomId, room);
	store.playerToRoom.set(playerId, roomId);
	store.socketToPlayer.set(socketId, playerId);

	return { room, playerId };
};

export const joinRoom = (roomId: string, playerName: string, socketId: string): { room: Room; playerId: string } | null => {
	const room = store.rooms.get(roomId);
	if (!room) return null;
	if (room.isStarted) return null;
	if (room.players.length >= room.maxPlayers) return null;

	const playerId = generateId();
	const player = createPlayer(playerId, playerName);

	room.players.push(player);
	store.playerToRoom.set(playerId, roomId);
	store.socketToPlayer.set(socketId, playerId);

	return { room, playerId };
};

export const leaveRoom = (socketId: string): { room: Room | null; playerId: string | null; shouldDeleteRoom: boolean } => {
	const playerId = store.socketToPlayer.get(socketId);
	if (!playerId) return { room: null, playerId: null, shouldDeleteRoom: false };

	const roomId = store.playerToRoom.get(playerId);
	if (!roomId) return { room: null, playerId, shouldDeleteRoom: false };

	const room = store.rooms.get(roomId);
	if (!room) return { room: null, playerId, shouldDeleteRoom: false };

	store.socketToPlayer.delete(socketId);
	store.playerToRoom.delete(playerId);

	if (room.isStarted) {
		const player = room.players.find((p) => p.id === playerId);
		if (player) {
			player.isAlive = false;
			player.isConnected = false;
		}
		if (room.gameState) {
			const gamePlayer = room.gameState.players.find((p) => p.id === playerId);
			if (gamePlayer) {
				gamePlayer.isAlive = false;
				gamePlayer.isConnected = false;
			}
		}

		const connectedPlayers = room.players.filter((p) => p.isConnected);
		if (connectedPlayers.length === 0) {
			store.rooms.delete(roomId);
			return { room: null, playerId, shouldDeleteRoom: true };
		}

		return { room, playerId, shouldDeleteRoom: false };
	}

	room.players = room.players.filter((p) => p.id !== playerId);

	if (room.players.length === 0) {
		store.rooms.delete(roomId);
		return { room: null, playerId, shouldDeleteRoom: true };
	}

	if (room.hostId === playerId) room.hostId = room.players[0].id;

	return { room, playerId, shouldDeleteRoom: false };
};

export const togglePlayerReady = (socketId: string): Room | null => {
	const playerId = store.socketToPlayer.get(socketId);
	if (!playerId) return null;

	const roomId = store.playerToRoom.get(playerId);
	if (!roomId) return null;

	const room = store.rooms.get(roomId);
	if (!room || room.isStarted) return null;

	const player = room.players.find((p) => p.id === playerId);
	if (player) {
		player.isReady = !player.isReady;
	}

	return room;
};

export const startGame = (socketId: string): { room: Room; gameState: GameState } | null => {
	const playerId = store.socketToPlayer.get(socketId);
	if (!playerId) return null;

	const roomId = store.playerToRoom.get(playerId);
	if (!roomId) return null;

	const room = store.rooms.get(roomId);
	if (!room) return null;
	if (room.hostId !== playerId) return null;
	if (room.players.length < 2) return null;
	if (!room.players.every((p) => p.isReady || p.id === room.hostId)) return null;

	room.isStarted = true;
	room.gameState = createInitialGameState(roomId, room.players);

	return { room, gameState: room.gameState };
};

export const getRoom = (roomId: string): Room | null => store.rooms.get(roomId) || null;

export const getRoomBySocketId = (socketId: string): Room | null => {
	const playerId = store.socketToPlayer.get(socketId);
	if (!playerId) return null;

	const roomId = store.playerToRoom.get(playerId);
	if (!roomId) return null;

	return store.rooms.get(roomId) || null;
};

export const getPlayerIdBySocketId = (socketId: string): string | null => store.socketToPlayer.get(socketId) || null;

export const getSocketIdByPlayerId = (playerId: string): string | null => {
	for (const [socketId, pId] of store.socketToPlayer.entries()) {
		if (pId === playerId) return socketId;
	}
	return null;
};

export const updateGameState = (roomId: string, gameState: GameState): void => {
	const room = store.rooms.get(roomId);
	if (room) room.gameState = gameState;
};

export const deleteRoom = (roomId: string): void => {
	const room = store.rooms.get(roomId);
	if (!room) return;

	room.players.forEach((p) => store.playerToRoom.delete(p.id));
	store.rooms.delete(roomId);
};

export const cleanupEmptyRooms = (): void => {
	const now = Date.now();
	for (const [roomId, room] of store.rooms.entries()) {
		const connectedPlayers = room.players.filter((p) => p.isConnected);
		if (connectedPlayers.length === 0) {
			console.log(`Cleaning up empty room: ${roomId}`);
			room.players.forEach((p) => store.playerToRoom.delete(p.id));
			store.rooms.delete(roomId);
		}
	}
};

export const getRoomCount = (): number => store.rooms.size;
