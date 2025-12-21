import { FC } from 'react';
import { Player } from '@coup/shared';
import { Card, CardBack } from './Card';

interface PlayerInfoProps {
    player: Player;
    isCurrentTurn: boolean;
    isYou: boolean;
    onSelect?: () => void;
    selectable?: boolean;
}

export const PlayerInfo: FC<PlayerInfoProps> = ({
    player,
    isCurrentTurn,
    isYou,
    onSelect,
    selectable = false,
}) => {
    const aliveCards = player.cards.filter(c => !c.isRevealed);
    const deadCards = player.cards.filter(c => c.isRevealed);

    return (
        <div
            onClick={selectable && player.isAlive && !isYou ? onSelect : undefined}
            className={`
                relative p-5 rounded-2xl border transition-all duration-500
                ${isCurrentTurn
                    ? 'bg-zinc-900/80 border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700/50'
                }
                ${!player.isAlive ? 'opacity-30' : ''}
                ${!player.isConnected ? 'border-dashed' : ''}
                ${selectable && player.isAlive && !isYou ? 'cursor-pointer hover:bg-zinc-900/60' : ''}
            `}
        >
            {isCurrentTurn && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            )}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {isCurrentTurn && (
                        <div className="status-indicator active" />
                    )}
                    <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold
                        ${isYou ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-400'}
                    `}>
                        {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-medium text-sm ${isYou ? 'text-zinc-100' : 'text-zinc-400'}`}>
                            {player.name}
                            {isYou && <span className="text-zinc-500 ml-1">(You)</span>}
                        </span>
                        {!player.isConnected && (
                            <span className="text-[10px] text-zinc-600">Disconnected</span>
                        )}
                    </div>
                </div>

                <div className="coin-display">
                    <div className="coin-icon">$</div>
                    <span className="font-mono font-medium text-amber-400">{player.coins}</span>
                </div>
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
                                className="animate-card-enter"
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
        </div>
    );
};