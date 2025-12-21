import { FC } from 'react';
import { GameState, GamePhase } from '@coup/shared';
import { PlayerInfo } from './PlayerInfo';
import { ActionButtons } from './ActionButtons';
import { ResponsePanel } from './ResponsePanel';
import { LoseInfluenceModal } from './LoseInfluenceModal';
import { ExchangeModal } from './ExchangeModal';
import { GameLog } from './GameLog';
import { Chat } from './Chat';
import { Card } from './Card';
import { ChatMessage } from '@coup/shared';

interface GameBoardProps {
    gameState: GameState;
    playerId: string;
    timer: number;
    chatMessages: ChatMessage[];
    onAction: (action: any, targetId?: string) => void;
    onChallenge: () => void;
    onPass: () => void;
    onBlock: (cardType: any) => void;
    onLoseInfluence: (cardId: string) => void;
    onExchange: (keepCardIds: string[]) => void;
    onSendChat: (message: string) => void;
    onLeaveRoom: () => void;
}

export const GameBoard: FC<GameBoardProps> = ({
    gameState,
    playerId,
    timer,
    chatMessages,
    onAction,
    onChallenge,
    onPass,
    onBlock,
    onLoseInfluence,
    onExchange,
    onSendChat,
    onLeaveRoom,
}) => {
    const myPlayer = gameState.players.find(p => p.id === playerId);
    const otherPlayers = gameState.players.filter(p => p.id !== playerId);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isMyTurn = currentPlayer.id === playerId;

    const needToLoseInfluence =
        (gameState.phase === GamePhase.LOSE_INFLUENCE ||
            gameState.phase === GamePhase.CHALLENGE_RESOLUTION) &&
        gameState.playerLosingInfluence === playerId;

    const needToExchange =
        gameState.phase === GamePhase.EXCHANGE_SELECT &&
        isMyTurn;

    const showResponsePanel =
        (gameState.phase === GamePhase.ACTION_RESPONSE ||
            gameState.phase === GamePhase.BLOCK_RESPONSE) &&
        myPlayer?.isAlive;

    const keepCount = myPlayer?.cards.filter(c => !c.isRevealed).length || 0;

    if (gameState.phase === GamePhase.GAME_OVER) {
        const winner = gameState.players.find(p => p.id === gameState.winner);
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-coup-card border-2 border-coup-border rounded-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold mb-4">Game Over!</h1>
                    <p className="text-xl mb-2">
                        {winner?.id === playerId ? '🎉 You Win! 🎉' : `${winner?.name} Wins!`}
                    </p>
                    <button onClick={onLeaveRoom} className="btn-primary mt-6">
                        Leave Game
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            {needToLoseInfluence && myPlayer && (
                <LoseInfluenceModal
                    cards={myPlayer.cards}
                    onSelectCard={onLoseInfluence}
                />
            )}

            {needToExchange && (
                <ExchangeModal
                    cards={gameState.exchangeCards}
                    keepCount={keepCount}
                    onConfirm={onExchange}
                />
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-400">
                        Room: <span className="font-mono">{gameState.roomId}</span>
                    </div>
                    <button onClick={onLeaveRoom} className="btn-secondary text-sm py-1 px-3">
                        Leave
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {otherPlayers.map((player) => (
                                <PlayerInfo
                                    key={player.id}
                                    player={player}
                                    isCurrentTurn={currentPlayer.id === player.id}
                                    isYou={false}
                                />
                            ))}
                        </div>

                        <div className="bg-coup-card border-2 border-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-yellow-400">Your Hand</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">●</span>
                                    <span className="font-mono text-xl">{myPlayer?.coins}</span>
                                    <span className="text-gray-400 text-sm ml-1">coins</span>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-center">
                                {myPlayer?.cards.map((card) => (
                                    <Card key={card.id} card={card} faceUp={true} />
                                ))}
                            </div>
                        </div>

                        <div className="text-center p-2 bg-coup-bg rounded">
                            {isMyTurn ? (
                                <span className="text-green-400 font-bold">Your Turn!</span>
                            ) : (
                                <span className="text-gray-400">
                                    Waiting for <span className="text-white">{currentPlayer.name}</span>...
                                </span>
                            )}
                        </div>

                        {showResponsePanel ? (
                            <ResponsePanel
                                gameState={gameState}
                                playerId={playerId}
                                timer={timer}
                                onChallenge={onChallenge}
                                onPass={onPass}
                                onBlock={onBlock}
                            />
                        ) : isMyTurn && gameState.phase === GamePhase.ACTION_SELECT && myPlayer ? (
                            <ActionButtons
                                myPlayer={myPlayer}
                                otherPlayers={otherPlayers}
                                onAction={onAction}
                                disabled={!myPlayer.isAlive}
                            />
                        ) : null}
                    </div>

                    <div className="space-y-4">
                        <GameLog logs={gameState.gameLog} />
                        <Chat
                            messages={chatMessages}
                            onSendMessage={onSendChat}
                            playerId={playerId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
