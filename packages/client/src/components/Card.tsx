import { FC } from 'react';
import { Card as CardType, CARD_INFO, CARD_BACK_IMAGE } from '@coup/shared';

interface CardProps {
    card?: CardType;
    faceUp?: boolean;
    onClick?: () => void;
    selected?: boolean;
    small?: boolean;
}

interface CardBackProps {
    small?: boolean;
}

export const Card: FC<CardProps> = ({ card, faceUp = false, onClick, selected = false, small = false, }) => {
    const showFace = faceUp && card;
    const info = card ? CARD_INFO[card.type] : null;
    const sizeClasses = small ? 'w-16 h-24' : 'w-24 h-36';

    if (!showFace) {
        return (
            <div
                onClick={onClick}
                className={`card-container ${sizeClasses} ${onClick ? 'cursor-pointer' : ''}`}
            >
                <div className={`
                    game-card w-full h-full overflow-hidden rounded-[10px]
                    ${selected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900' : ''}
                `}>
                    <img
                        src={CARD_BACK_IMAGE}
                        alt="Card back"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`card-container ${sizeClasses} ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className={`
                game-card w-full h-full overflow-hidden rounded-[10px]
                ${card?.isRevealed ? 'opacity-40 grayscale' : ''}
                ${selected ? `ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900 scale-105` : ''}
            `}>
                <img
                    src={info?.image}
                    alt={info?.name}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};



export const CardBack: FC<CardBackProps> = ({ small = false }) => {
    const sizeClasses = small ? 'w-16 h-24' : 'w-24 h-36';

    return (
        <div className={`card-container ${sizeClasses}`}>
            <div className="game-card w-full h-full overflow-hidden rounded-[10px]">
                <img
                    src={CARD_BACK_IMAGE}
                    alt="Card back"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};