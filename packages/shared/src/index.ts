export enum CardType {
	DUKE = 'DUKE',
	ASSASSIN = 'ASSASSIN',
	CAPTAIN = 'CAPTAIN',
	AMBASSADOR = 'AMBASSADOR',
	CONTESSA = 'CONTESSA',
}

export enum ActionType {
	INCOME = 'INCOME',
	FOREIGN_AID = 'FOREIGN_AID',
	COUP = 'COUP',
	TAX = 'TAX',
	ASSASSINATE = 'ASSASSINATE',
	STEAL = 'STEAL',
	EXCHANGE = 'EXCHANGE',
}

export enum GamePhase {
	LOBBY = 'LOBBY',
	ACTION_SELECT = 'ACTION_SELECT',
	ACTION_RESPONSE = 'ACTION_RESPONSE',
	CHALLENGE_RESOLUTION = 'CHALLENGE_RESOLUTION',
	BLOCK_RESPONSE = 'BLOCK_RESPONSE',
	LOSE_INFLUENCE = 'LOSE_INFLUENCE',
	EXCHANGE_SELECT = 'EXCHANGE_SELECT',
	GAME_OVER = 'GAME_OVER',
}

export interface Card {
	id: string;
	type: CardType;
	isRevealed: boolean;
}

export interface Player {
	id: string;
	name: string;
	coins: number;
	cards: Card[];
	isAlive: boolean;
	isConnected: boolean;
	isReady: boolean;
}

export interface PendingAction {
	type: ActionType;
	playerId: string;
	targetId?: string;
	canBeBlocked: boolean;
	canBeChallenged: boolean;
	blockableBy: CardType[];
	requiredCard?: CardType;
	targetRequired: boolean;
}

export interface PendingBlock {
	playerId: string;
	claimedCard: CardType;
}

export interface GameState {
	roomId: string;
	players: Player[];
	currentPlayerIndex: number;
	phase: GamePhase;
	deck: Card[];
	pendingAction: PendingAction | null;
	pendingBlock: PendingBlock | null;
	challengerId: string | null;
	playerLosingInfluence: string | null;
	exchangeCards: Card[];
	winner: string | null;
	turnTimeRemaining: number;
	gameLog: LogEntry[];
	passedPlayers: string[];
}

export interface LogEntry {
	id: string;
	timestamp: number;
	message: string;
	type: 'action' | 'challenge' | 'block' | 'system' | 'elimination';
}

export interface Room {
	id: string;
	hostId: string;
	players: Player[];
	gameState: GameState | null;
	maxPlayers: number;
	isStarted: boolean;
}

export interface ChatMessage {
	id: string;
	playerId: string;
	playerName: string;
	message: string;
	timestamp: number;
}

export interface ServerToClientEvents {
	roomUpdate: (room: Room) => void;
	gameStateUpdate: (gameState: GameState) => void;
	chatMessage: (message: ChatMessage) => void;
	error: (message: string) => void;
	timerUpdate: (seconds: number) => void;
	playerReconnected: (playerId: string) => void;
	playerDisconnected: (playerId: string) => void;
}

export interface ClientToServerEvents {
	createRoom: (playerName: string, callback: (response: RoomResponse) => void) => void;
	joinRoom: (roomId: string, playerName: string, callback: (response: RoomResponse) => void) => void;
	rejoinRoom: (roomId: string, playerId: string, callback: (response: RoomResponse) => void) => void;
	leaveRoom: () => void;
	toggleReady: () => void;
	startGame: () => void;
	performAction: (action: ActionType, targetId?: string) => void;
	challenge: () => void;
	passChallenge: () => void;
	block: (cardType: CardType) => void;
	passBlock: () => void;
	loseInfluence: (cardId: string) => void;
	selectExchangeCards: (keepCardIds: string[]) => void;
	sendChat: (message: string) => void;
}

export interface RoomResponse {
	success: boolean;
	room?: Room;
	playerId?: string;
	error?: string;
}

export const ACTION_CONFIG: Record<
	ActionType,
	{
		cost: number;
		targetRequired: boolean;
		canBeBlocked: boolean;
		canBeChallenged: boolean;
		blockableBy: CardType[];
		requiredCard?: CardType;
	}
> = {
	[ActionType.INCOME]: {
		cost: 0,
		targetRequired: false,
		canBeBlocked: false,
		canBeChallenged: false,
		blockableBy: [],
	},
	[ActionType.FOREIGN_AID]: {
		cost: 0,
		targetRequired: false,
		canBeBlocked: true,
		canBeChallenged: false,
		blockableBy: [CardType.DUKE],
	},
	[ActionType.COUP]: {
		cost: 7,
		targetRequired: true,
		canBeBlocked: false,
		canBeChallenged: false,
		blockableBy: [],
	},
	[ActionType.TAX]: {
		cost: 0,
		targetRequired: false,
		canBeBlocked: false,
		canBeChallenged: true,
		blockableBy: [],
		requiredCard: CardType.DUKE,
	},
	[ActionType.ASSASSINATE]: {
		cost: 3,
		targetRequired: true,
		canBeBlocked: true,
		canBeChallenged: true,
		blockableBy: [CardType.CONTESSA],
		requiredCard: CardType.ASSASSIN,
	},
	[ActionType.STEAL]: {
		cost: 0,
		targetRequired: true,
		canBeBlocked: true,
		canBeChallenged: true,
		blockableBy: [CardType.CAPTAIN, CardType.AMBASSADOR],
		requiredCard: CardType.CAPTAIN,
	},
	[ActionType.EXCHANGE]: {
		cost: 0,
		targetRequired: false,
		canBeBlocked: false,
		canBeChallenged: true,
		blockableBy: [],
		requiredCard: CardType.AMBASSADOR,
	},
};

export const CARD_INFO: Record<
	CardType,
	{
		name: string;
		icon: string;
		ability: string;
		blockAbility?: string;
	}
> = {
	[CardType.DUKE]: {
		name: 'Duke',
		icon: '👑',
		ability: 'Tax: Take 3 coins',
		blockAbility: 'Blocks Foreign Aid',
	},
	[CardType.ASSASSIN]: {
		name: 'Assassin',
		icon: '🗡️',
		ability: 'Assassinate: Pay 3, kill target',
	},
	[CardType.CAPTAIN]: {
		name: 'Captain',
		icon: '⚓',
		ability: 'Steal: Take 2 coins from target',
		blockAbility: 'Blocks Stealing',
	},
	[CardType.AMBASSADOR]: {
		name: 'Ambassador',
		icon: '📜',
		ability: 'Exchange: Swap cards with deck',
		blockAbility: 'Blocks Stealing',
	},
	[CardType.CONTESSA]: {
		name: 'Contessa',
		icon: '👸',
		ability: 'No action',
		blockAbility: 'Blocks Assassination',
	},
};

export const CHALLENGE_TIMER_SECONDS = 30;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;
export const STARTING_COINS = 2;
export const CARDS_PER_TYPE = 3;
