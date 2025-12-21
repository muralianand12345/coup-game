import { FC, useState } from 'react';
import { GameState, GamePhase, ChatMessage } from '@coup/shared';
import { Chat } from './Chat';
import { Card } from './Card';
import { GameLog } from './GameLog';
import { PlayerInfo } from './PlayerInfo';
import { ActionButtons } from './ActionButtons';
import { ResponsePanel } from './ResponsePanel';
import { ExchangeModal } from './ExchangeModal';
import { LoseInfluenceModal } from './LoseInfluenceModal';
import { Cheatsheet, CheatsheetButton } from './Cheatsheet';

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
    const [showCheatsheet, setShowCheatsheet] = useState(false);

    const myPlayer = gameState.players.find(p => p.id === playerId);
    const otherPlayers = gameState.players.filter(p => p.id !== playerId);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isMyTurn = currentPlayer.id === playerId;

    const needToLoseInfluence =
        (gameState.phase === GamePhase.LOSE_INFLUENCE ||
            gameState.phase === GamePhase.CHALLENGE_RESOLUTION) &&
        gameState.playerLosingInfluence === playerId;

    const needToExchange =
        gameState.phase === GamePhase.EXCHANGE_SELECT && isMyTurn;

    const showResponsePanel =
        (gameState.phase === GamePhase.ACTION_RESPONSE ||
            gameState.phase === GamePhase.BLOCK_RESPONSE) &&
        myPlayer?.isAlive;

    const keepCount = myPlayer?.cards.filter(c => !c.isRevealed).length || 0;

    if (gameState.phase === GamePhase.GAME_OVER) {
        const winner = gameState.players.find(p => p.id === gameState.winner);
        const isWinner = winner?.id === playerId;

        return (
            <div className="page-container min-h-screen flex items-center justify-center p-6">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {isWinner && (
                        <>
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </>
                    )}
                </div>

                <div className="glass-panel p-12 max-w-md w-full text-center animate-scale-in relative z-10">
                    <div className="text-6xl mb-6 animate-float">
                        {isWinner ? '👑' : '💀'}
                    </div>
                    <h1 className="text-3xl font-bold mb-4 tracking-tight">Game Over</h1>
                    <p className="text-xl mb-8">
                        {isWinner ? (
                            <span className="text-amber-400">You Win!</span>
                        ) : (
                            <span className="text-zinc-400">
                                <span className="text-zinc-100">{winner?.name}</span> Wins
                            </span>
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
        <div className="page-container min-h-screen">
            <Cheatsheet isOpen={showCheatsheet} onClose={() => setShowCheatsheet(false)} />

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

            <header className="sticky top-0 z-10 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <h1 className="text-xl font-bold tracking-tight">COUP</h1>
                            <div className="h-6 w-px bg-zinc-800" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Room</span>
                                <span className="font-mono text-sm text-zinc-300">{gameState.roomId}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheatsheetButton onClick={() => setShowCheatsheet(true)} />
                            <button onClick={onLeaveRoom} className="btn-secondary text-xs py-2 px-4">
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-3 space-y-3">
                        {otherPlayers.map((player, index) => (
                            <div
                                key={player.id}
                                className="animate-slide-in-left"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <PlayerInfo
                                    player={player}
                                    isCurrentTurn={currentPlayer.id === player.id}
                                    isYou={false}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-6 space-y-6">
                        <div className="glass-panel p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Your Hand</span>
                                <div className="coin-display">
                                    <div className="coin-icon">$</div>
                                    <span className="font-mono text-lg font-medium text-amber-400">{myPlayer?.coins}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-center">
                                {myPlayer?.cards.map((card, index) => (
                                    <div
                                        key={card.id}
                                        className="animate-card-enter"
                                        style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                                    >
                                        <Card card={card} faceUp={true} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`
                                text-center p-4 rounded-xl border transition-all duration-500 animate-fade-in-up
                                ${isMyTurn
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : 'bg-zinc-900/40 border-zinc-800/50'
                                }
                            `}
                            style={{ animationDelay: '0.2s' }}
                        >
                            {isMyTurn ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="status-indicator active" />
                                    <span className="text-emerald-400 font-medium">Your Turn</span>
                                </div>
                            ) : (
                                <span className="text-zinc-500">
                                    Waiting for <span className="text-zinc-300 font-medium">{currentPlayer.name}</span>
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

                    <div className="lg:col-span-3 space-y-4">
                        <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                            <GameLog logs={gameState.gameLog} />
                        </div>
                        <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                            <Chat
                                messages={chatMessages}
                                onSendMessage={onSendChat}
                                playerId={playerId}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};