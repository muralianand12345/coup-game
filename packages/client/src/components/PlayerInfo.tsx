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
        p-4 rounded-lg border-2 transition-all
        ${isCurrentTurn ? 'border-white bg-white/5' : 'border-coup-border bg-coup-card'}
        ${!player.isAlive ? 'opacity-40' : ''}
        ${!player.isConnected ? 'border-dashed' : ''}
        ${selectable && player.isAlive && !isYou ? 'cursor-pointer hover:border-white' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${isYou ? 'text-yellow-400' : ''}`}>
            {player.name}
            {isYou && ' (You)'}
          </span>
          {!player.isConnected && (
            <span className="text-xs text-gray-500">(disconnected)</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">●</span>
          <span className="font-mono">{player.coins}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {isYou ? (
          player.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              faceUp={true}
              small={true}
            />
          ))
        ) : (
          <>
            {aliveCards.map((card) => (
              <CardBack key={card.id} small={true} />
            ))}
            {deadCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                faceUp={true}
                small={true}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
