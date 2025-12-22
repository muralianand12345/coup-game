import { FC, useState } from 'react';
import { Player, LogEntry } from '@coup/shared';
import { Card, CardBack } from './Card';
import { CoinDisplay } from './CoinAnimation';
import { ActionHistoryTooltip } from './ActionHistoryTooltip';

interface PlayerInfoProps {
    player: Player;
    isCurrentTurn: boolean;
    isYou: boolean;
    onSelect?: () => void;
    selectable?: boolean;
    isTarget?: boolean;
    logs?: LogEntry[];
}

export const PlayerInfo: FC<PlayerInfoProps> = ({ player, isCurrentTurn, isYou, onSelect, selectable = false, isTarget = false, logs = [] }) => {
    const [isHovered, setIsHovered] = useState(false);
    const aliveCards = player.cards.filter((c) => !c.isRevealed);
    const deadCards = player.cards.filter((c) => c.isRevealed);

    return (
        <div
            onClick={selectable && player.isAlive && !isYou ? onSelect : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative p-5 rounded-2xl border transition-all duration-300
                ${isCurrentTurn ? 'bg-zinc-900/80 border-amber-500/30 shadow-lg shadow-amber-500/10' : 'bg-zinc-900/40 border-zinc-800/50'}
                ${!player.isAlive ? 'opacity-40 grayscale' : ''}
                ${!player.isConnected ? 'border-dashed border-zinc-700' : ''}
                ${selectable && player.isAlive && !isYou ? 'cursor-pointer hover:bg-zinc-800/60 hover:border-zinc-600 hover:scale-[1.02] active:scale-[0.98]' : ''}
                ${isTarget ? 'ring-2 ring-red-500/60 ring-offset-2 ring-offset-zinc-950 border-red-500/30' : ''}
                ${isHovered && selectable && player.isAlive && !isYou ? 'shadow-lg shadow-zinc-900/50' : ''}
            `}
        >
            {isCurrentTurn && (
                <>
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                    <div className="absolute inset-0 rounded-2xl bg-amber-500/5 pointer-events-none" />
                </>
            )}

            {selectable && player.isAlive && !isYou && isHovered && (
                <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/40 pointer-events-none animate-pulse" />
            )}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {isCurrentTurn && <div className="status-indicator active" />}
                    <div
                        className={`
                            w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold
                            transition-all duration-300
                            ${isYou ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-900 shadow-lg shadow-amber-500/20' : 'bg-zinc-800 text-zinc-400'}
                            ${isHovered && selectable && !isYou ? 'scale-110 bg-zinc-700' : ''}
                        `}
                    >
                        {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm ${isYou ? 'text-zinc-100' : 'text-zinc-400'}`}>
                                {player.name}
                                {isYou && <span className="text-zinc-500 ml-1">(You)</span>}
                            </span>
                            {logs.length > 0 && !isYou && (
                                <ActionHistoryTooltip logs={logs} playerName={player.name} />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {!player.isConnected && (
                                <span className="text-[10px] text-red-400 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Disconnected
                                </span>
                            )}
                            {!player.isAlive && (
                                <span className="text-[10px] text-zinc-600">Eliminated</span>
                            )}
                            {player.isAlive && player.isConnected && isCurrentTurn && (
                                <span className="text-[10px] text-amber-400">Taking turn...</span>
                            )}
                        </div>
                    </div>
                </div>

                <CoinDisplay coins={player.coins} playerId={player.id} size="sm" />
            </div>

            <div className="flex gap-2 justify-center">
                {isYou ? (
                    player.cards.map((card, index) => (
                        <div
                            key={card.id}
                            className="animate-card-enter"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Card card={card} faceUp={true} small={true} />
                        </div>
                    ))
                ) : (
                    <>
                        {aliveCards.map((card, index) => (
                            <div
                                key={card.id}
                                className={`animate-card-enter transition-transform duration-300 ${isHovered && selectable ? 'scale-105' : ''}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardBack small={true} />
                            </div>
                        ))}
                        {deadCards.map((card, index) => (
                            <div
                                key={card.id}
                                className="animate-card-enter"
                                style={{ animationDelay: `${(aliveCards.length + index) * 0.1}s` }}
                            >
                                <Card card={card} faceUp={true} small={true} />
                            </div>
                        ))}
                    </>
                )}
            </div>

            {player.isAlive && aliveCards.length > 0 && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {aliveCards.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isCurrentTurn ? 'bg-amber-500' : 'bg-emerald-500/60'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
