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
        p-5 rounded-xl border transition-all duration-300
        ${isCurrentTurn ? 'border-white bg-white/5 shadow-lg shadow-white/10' : 'border-coup-border bg-coup-card/50'}
        ${!player.isAlive ? 'opacity-30' : ''}
        ${!player.isConnected ? 'border-dashed opacity-50' : ''}
        ${selectable && player.isAlive && !isYou ? 'cursor-pointer hover:border-coup-border-light hover:bg-coup-card-hover active:scale-98' : ''}
      `}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {isCurrentTurn && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    <span className={`font-medium ${isYou ? 'text-white' : 'text-gray-400'}`}>
                        {player.name}
                        {isYou && ' (You)'}
                    </span>
                    {!player.isConnected && (
                        <span className="text-[10px] text-gray-600">(disconnected)</span>
                    )}
                </div>
                <div className="flex items-center gap-2 bg-coup-card px-3 py-1.5 rounded-lg border border-coup-border">
                    <span className="text-yellow-400 text-lg">●</span>
                    <span className="font-mono font-medium">{player.coins}</span>
                </div>
            </div>

            <div className="flex gap-2">
                {isYou ? (
                    player.cards.map((card, index) => (
                        <div key={card.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <Card
                                card={card}
                                faceUp={true}
                                small={true}
                            />
                        </div>
                    ))
                ) : (
                    <>
                        {aliveCards.map((card, index) => (
                            <div key={card.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <CardBack small={true} />
                            </div>
                        ))}
                        {deadCards.map((card, index) => (
                            <div key={card.id} className="animate-fade-in-up" style={{ animationDelay: `${(aliveCards.length + index) * 100}ms` }}>
                                <Card
                                    card={card}
                                    faceUp={true}
                                    small={true}
                                />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};
