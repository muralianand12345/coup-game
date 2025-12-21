import { FC } from 'react';
import { Card as CardType, CardType as CardTypeEnum, CARD_INFO } from '@coup/shared';

interface CardProps {
  card?: CardType;
  faceUp?: boolean;
  onClick?: () => void;
  selected?: boolean;
  small?: boolean;
}

const cardColors: Record<CardTypeEnum, string> = {
  [CardTypeEnum.DUKE]: '#7c3aed',
  [CardTypeEnum.ASSASSIN]: '#1f2937',
  [CardTypeEnum.CAPTAIN]: '#0369a1',
  [CardTypeEnum.AMBASSADOR]: '#059669',
  [CardTypeEnum.CONTESSA]: '#be123c',
};

export const Card: FC<CardProps> = ({ 
  card, 
  faceUp = false, 
  onClick, 
  selected = false,
  small = false,
}) => {
  const showFace = faceUp && card;
  const info = card ? CARD_INFO[card.type] : null;
  const color = card ? cardColors[card.type] : '#333';

  const baseClasses = small 
    ? 'w-16 h-24 text-xs' 
    : 'w-24 h-36 text-sm';

  if (!showFace) {
    return (
      <div
        onClick={onClick}
        className={`${baseClasses} rounded-lg border-2 border-coup-border bg-coup-card flex items-center justify-center cursor-pointer hover:border-white transition-all ${selected ? 'ring-2 ring-white' : ''}`}
      >
        <div className="text-2xl opacity-30">?</div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} rounded-lg border-2 flex flex-col items-center justify-between p-2 cursor-pointer transition-all ${card?.isRevealed ? 'opacity-50' : ''} ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
      style={{ 
        borderColor: color, 
        backgroundColor: 'white',
      }}
    >
      <div 
        className="text-3xl"
        style={{ filter: card?.isRevealed ? 'grayscale(1)' : 'none' }}
      >
        {info?.icon}
      </div>
      <div 
        className="font-bold text-center"
        style={{ color }}
      >
        {info?.name}
      </div>
      <div className="text-[10px] text-gray-600 text-center leading-tight">
        {small ? '' : info?.ability}
      </div>
    </div>
  );
};

interface CardBackProps {
  small?: boolean;
}

export const CardBack: FC<CardBackProps> = ({ small = false }) => {
  const baseClasses = small 
    ? 'w-16 h-24' 
    : 'w-24 h-36';

  return (
    <div className={`${baseClasses} rounded-lg border-2 border-coup-border bg-coup-card flex items-center justify-center`}>
      <div className="w-8 h-8 border-2 border-coup-border rotate-45" />
    </div>
  );
};
