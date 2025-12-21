import { GameState, GamePhase, Player, Card, CardType, ActionType, PendingAction, LogEntry, ACTION_CONFIG, STARTING_COINS, CARDS_PER_TYPE } from '@coup/shared';
import { generateId, shuffleArray } from '../utils/helpers';

export const createDeck = (): Card[] => {
	const deck: Card[] = [];
	const cardTypes = Object.values(CardType);

	cardTypes.forEach((type) => {
		for (let i = 0; i < CARDS_PER_TYPE; i++) {
			deck.push({ id: generateId(), type, isRevealed: false });
		}
	});

	return shuffleArray(deck);
};

export const createPlayer = (id: string, name: string): Player => ({ id, name, coins: STARTING_COINS, cards: [], isAlive: true, isConnected: true, isReady: false });

export const createInitialGameState = (roomId: string, players: Player[]): GameState => {
	const deck = createDeck();
	const gamePlayers: Player[] = players.map((p) => ({ ...p, coins: STARTING_COINS, cards: [] as Card[], isAlive: true }));

	gamePlayers.forEach((player) => {
		const card1 = deck.pop();
		const card2 = deck.pop();
		if (card1 && card2) player.cards = [card1, card2];
	});

	return {
		roomId,
		players: gamePlayers,
		currentPlayerIndex: 0,
		phase: GamePhase.ACTION_SELECT,
		deck,
		pendingAction: null,
		pendingBlock: null,
		challengerId: null,
		playerLosingInfluence: null,
		exchangeCards: [],
		winner: null,
		turnTimeRemaining: 0,
		gameLog: [{ id: generateId(), timestamp: Date.now(), message: 'Game started!', type: 'system' }],
		passedPlayers: [],
	};
};

export const addLogEntry = (state: GameState, message: string, type: LogEntry['type'] = 'action'): void => {
	state.gameLog.push({ id: generateId(), timestamp: Date.now(), message, type });
};

export const getCurrentPlayer = (state: GameState): Player => state.players[state.currentPlayerIndex];

export const getPlayerById = (state: GameState, playerId: string): Player | undefined => state.players.find((p) => p.id === playerId);

export const getAlivePlayersCount = (state: GameState): number => state.players.filter((p) => p.isAlive).length;

export const getNextAlivePlayerIndex = (state: GameState, fromIndex: number): number => {
	let index = (fromIndex + 1) % state.players.length;
	while (!state.players[index].isAlive) {
		index = (index + 1) % state.players.length;
	}
	return index;
};

export const advanceTurn = (state: GameState): void => {
	state.currentPlayerIndex = getNextAlivePlayerIndex(state, state.currentPlayerIndex);
	state.phase = GamePhase.ACTION_SELECT;
	state.pendingAction = null;
	state.pendingBlock = null;
	state.challengerId = null;
	state.playerLosingInfluence = null;
	state.exchangeCards = [];
};

export const checkForWinner = (state: GameState): void => {
	const alivePlayers = state.players.filter((p) => p.isAlive);
	if (alivePlayers.length === 1) {
		state.winner = alivePlayers[0].id;
		state.phase = GamePhase.GAME_OVER;
		addLogEntry(state, `${alivePlayers[0].name} wins the game!`, 'system');
	}
};

export const playerLosesInfluence = (state: GameState, playerId: string, cardId: string): void => {
	const player = getPlayerById(state, playerId);
	if (!player) return;

	const card = player.cards.find((c) => c.id === cardId && !c.isRevealed);
	if (!card) return;

	card.isRevealed = true;
	addLogEntry(state, `${player.name} reveals ${card.type}`, 'elimination');

	const aliveCards = player.cards.filter((c) => !c.isRevealed);
	if (aliveCards.length === 0) {
		player.isAlive = false;
		addLogEntry(state, `${player.name} has been eliminated!`, 'elimination');
	}

	checkForWinner(state);
};

export const playerHasCard = (player: Player, cardType: CardType): boolean => player.cards.some((c) => c.type === cardType && !c.isRevealed);

export const getPlayerUnrevealedCards = (player: Player): Card[] => player.cards.filter((c) => !c.isRevealed);

export const canPerformAction = (state: GameState, playerId: string, action: ActionType, targetId?: string): boolean => {
	const player = getPlayerById(state, playerId);
	if (!player || !player.isAlive) return false;

	const config = ACTION_CONFIG[action];

	if (player.coins < config.cost) return false;
	if (player.coins >= 10 && action !== ActionType.COUP) return false;

	if (config.targetRequired) {
		if (!targetId) return false;
		const target = getPlayerById(state, targetId);
		if (!target || !target.isAlive || target.id === playerId) return false;
		if (action === ActionType.STEAL && target.coins === 0) return false;
	}

	return true;
};

export const createPendingAction = (action: ActionType, playerId: string, targetId?: string): PendingAction => {
	const config = ACTION_CONFIG[action];
	return {
		type: action,
		playerId,
		targetId,
		canBeBlocked: config.canBeBlocked,
		canBeChallenged: config.canBeChallenged,
		blockableBy: config.blockableBy,
		requiredCard: config.requiredCard,
		targetRequired: config.targetRequired,
	};
};

export const executeAction = (state: GameState): void => {
	const action = state.pendingAction;
	if (!action) return;

	const player = getPlayerById(state, action.playerId);
	if (!player) return;

	const config = ACTION_CONFIG[action.type];
	player.coins -= config.cost;

	switch (action.type) {
		case ActionType.INCOME:
			player.coins += 1;
			addLogEntry(state, `${player.name} takes income (+1 coin)`);
			advanceTurn(state);
			break;

		case ActionType.FOREIGN_AID:
			player.coins += 2;
			addLogEntry(state, `${player.name} takes foreign aid (+2 coins)`);
			advanceTurn(state);
			break;

		case ActionType.COUP: {
			const target = getPlayerById(state, action.targetId!);
			if (target) {
				addLogEntry(state, `${player.name} launches a coup against ${target.name}`);
				state.playerLosingInfluence = target.id;
				state.phase = GamePhase.LOSE_INFLUENCE;
			}
			break;
		}

		case ActionType.TAX:
			player.coins += 3;
			addLogEntry(state, `${player.name} collects tax (+3 coins)`);
			advanceTurn(state);
			break;

		case ActionType.ASSASSINATE: {
			const target = getPlayerById(state, action.targetId!);
			if (target) {
				addLogEntry(state, `${player.name} assassinates ${target.name}`);
				state.playerLosingInfluence = target.id;
				state.phase = GamePhase.LOSE_INFLUENCE;
			}
			break;
		}

		case ActionType.STEAL: {
			const target = getPlayerById(state, action.targetId!);
			if (target) {
				const stolenAmount = Math.min(2, target.coins);
				target.coins -= stolenAmount;
				player.coins += stolenAmount;
				addLogEntry(state, `${player.name} steals ${stolenAmount} coins from ${target.name}`);
				advanceTurn(state);
			}
			break;
		}

		case ActionType.EXCHANGE: {
			const drawnCards = [state.deck.pop()!, state.deck.pop()!];
			state.exchangeCards = [...getPlayerUnrevealedCards(player), ...drawnCards];
			state.phase = GamePhase.EXCHANGE_SELECT;
			addLogEntry(state, `${player.name} exchanges cards with the deck`);
			break;
		}
	}
};

export const handleChallenge = (state: GameState, challengerId: string, claimedCard: CardType, challengedPlayerId: string): boolean => {
	const challenger = getPlayerById(state, challengerId);
	const challenged = getPlayerById(state, challengedPlayerId);

	if (!challenger || !challenged) return false;

	const hasCard = playerHasCard(challenged, claimedCard);

	if (hasCard) {
		addLogEntry(state, `${challenger.name} challenges ${challenged.name} - Challenge FAILED!`, 'challenge');

		const revealedCard = challenged.cards.find((c) => c.type === claimedCard && !c.isRevealed)!;
		state.deck.push({ ...revealedCard, isRevealed: false });
		state.deck = shuffleArray(state.deck);

		const cardIndex = challenged.cards.findIndex((c) => c.id === revealedCard.id);
		challenged.cards[cardIndex] = state.deck.pop()!;

		state.challengerId = challengerId;
		state.playerLosingInfluence = challengerId;
		state.phase = GamePhase.CHALLENGE_RESOLUTION;
		return false;
	} else {
		addLogEntry(state, `${challenger.name} challenges ${challenged.name} - Challenge SUCCESSFUL!`, 'challenge');
		state.challengerId = challengerId;
		state.playerLosingInfluence = challengedPlayerId;
		state.phase = GamePhase.CHALLENGE_RESOLUTION;
		return true;
	}
};

export const handleBlock = (state: GameState, blockerId: string, claimedCard: CardType): void => {
	const blocker = getPlayerById(state, blockerId);
	if (!blocker) return;

	state.pendingBlock = {
		playerId: blockerId,
		claimedCard,
	};
	state.phase = GamePhase.BLOCK_RESPONSE;
	addLogEntry(state, `${blocker.name} blocks with ${claimedCard}`, 'block');
};

export const completeExchange = (state: GameState, playerId: string, keepCardIds: string[]): void => {
	const player = getPlayerById(state, playerId);
	if (!player) return;

	const unrevealedCount = getPlayerUnrevealedCards(player).length;
	if (keepCardIds.length !== unrevealedCount) return;

	const keptCards = state.exchangeCards.filter((c) => keepCardIds.includes(c.id));
	const returnedCards = state.exchangeCards.filter((c) => !keepCardIds.includes(c.id));

	player.cards = [...player.cards.filter((c) => c.isRevealed), ...keptCards];

	returnedCards.forEach((card) => state.deck.push(card));
	state.deck = shuffleArray(state.deck);

	state.exchangeCards = [];
	advanceTurn(state);
};

export const getPublicGameState = (state: GameState, forPlayerId: string): GameState => {
	return {
		...state,
		deck: [],
		players: state.players.map((p) => ({ ...p, cards: p.cards.map((c) => (p.id === forPlayerId || c.isRevealed ? c : { ...c, type: CardType.DUKE, id: c.id })) })),
		exchangeCards: forPlayerId === getCurrentPlayer(state).id ? state.exchangeCards : [],
	};
};
