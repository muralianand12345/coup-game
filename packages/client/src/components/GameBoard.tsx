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
            <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
                <div className="glass-panel p-12 max-w-md w-full text-center animate-scale-in">
                    <div className="text-6xl mb-6">🏆</div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">GAME OVER</h1>
                    <p className="text-2xl mb-8 text-gray-400">
                        {winner?.id === playerId ? (
                            <span className="text-white">You Win!</span>
                        ) : (
                            <span><span className="text-white">{winner?.name}</span> Wins</span>
                        )}
                    </p>
                    <button onClick={onLeaveRoom} className="btn-primary w-full py-4">
                        Leave Game
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen animate-fade-in">
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

            <div className="border-b border-coup-border bg-coup-card/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">COUP</h1>
                            </div>
                            <div className="h-8 w-px bg-coup-border" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-600 uppercase tracking-wide">Room</span>
                                <span className="font-mono text-sm text-white">{gameState.roomId}</span>
                            </div>
                        </div>
                        <button onClick={onLeaveRoom} className="btn-secondary text-xs py-2 px-4">
                            Leave Game
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {otherPlayers.map((player, index) => (
                                <div key={player.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                    <PlayerInfo
                                        player={player}
                                        isCurrentTurn={currentPlayer.id === player.id}
                                        isYou={false}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="glass-panel p-6 glow-border animate-fade-in-up">
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-sm text-gray-500 uppercase tracking-wide">Your Hand</span>
                                <div className="flex items-center gap-2 bg-coup-card px-4 py-2 rounded-lg border border-coup-border">
                                    <span className="text-yellow-400 text-lg">●</span>
                                    <span className="font-mono text-xl font-medium">{myPlayer?.coins}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-center">
                                {myPlayer?.cards.map((card, index) => (
                                    <div key={card.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                        <Card card={card} faceUp={true} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center p-4 rounded-xl bg-coup-card border border-coup-border">
                            {isMyTurn ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-green-400 font-medium">Your Turn</span>
                                </div>
                            ) : (
                                <span className="text-gray-500">
                                    Waiting for <span className="text-white font-medium">{currentPlayer.name}</span>
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
