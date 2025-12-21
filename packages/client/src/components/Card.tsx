import { FC } from 'react';
import { Card as CardType, CardType as CardTypeEnum, CARD_INFO } from '@coup/shared';

interface CardProps {
    card?: CardType;
    faceUp?: boolean;
    onClick?: () => void;
    selected?: boolean;
    small?: boolean;
}

const cardStyles: Record<CardTypeEnum, { bg: string; accent: string; icon: string }> = {
    [CardTypeEnum.DUKE]: {
        bg: 'from-violet-600 to-purple-700',
        accent: 'violet',
        icon: '👑'
    },
    [CardTypeEnum.ASSASSIN]: {
        bg: 'from-zinc-700 to-zinc-900',
        accent: 'zinc',
        icon: '🗡️'
    },
    [CardTypeEnum.CAPTAIN]: {
        bg: 'from-sky-600 to-blue-700',
        accent: 'sky',
        icon: '⚓'
    },
    [CardTypeEnum.AMBASSADOR]: {
        bg: 'from-emerald-600 to-green-700',
        accent: 'emerald',
        icon: '📜'
    },
    [CardTypeEnum.CONTESSA]: {
        bg: 'from-rose-600 to-pink-700',
        accent: 'rose',
        icon: '👸'
    },
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
    const styles = card ? cardStyles[card.type] : null;

    const sizeClasses = small ? 'w-16 h-24' : 'w-24 h-36';
    const iconSize = small ? 'text-xl' : 'text-3xl';
    const nameSize = small ? 'text-[9px]' : 'text-xs';

    if (!showFace) {
        return (
            <div
                onClick={onClick}
                className={`
                    card-container ${sizeClasses}
                    ${onClick ? 'cursor-pointer' : ''}
                `}
            >
                <div className={`
                    game-card game-card-back w-full h-full
                    ${selected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900' : ''}
                `}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border border-zinc-700 rotate-45 opacity-40" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`
                card-container ${sizeClasses}
                ${onClick ? 'cursor-pointer' : ''}
            `}
        >
            <div className={`
                game-card game-card-front w-full h-full p-2
                ${card?.isRevealed ? 'opacity-40 grayscale' : ''}
                ${selected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900 scale-105' : ''}
            `}>
                <div className={`
                    absolute inset-0 bg-gradient-to-br ${styles?.bg} opacity-10 rounded-[14px]
                `} />

                <div className="relative z-10 h-full flex flex-col items-center justify-between py-1">
                    <div className={`${iconSize} transition-transform duration-300`}>
                        {styles?.icon}
                    </div>

                    <div className="text-center">
                        <div className={`font-semibold ${nameSize} tracking-wide text-zinc-800`}>
                            {info?.name}
                        </div>
                        {!small && (
                            <div className="text-[8px] text-zinc-500 mt-1 leading-tight px-1">
                                {info?.ability}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface CardBackProps {
    small?: boolean;
}

export const CardBack: FC<CardBackProps> = ({ small = false }) => {
    const sizeClasses = small ? 'w-16 h-24' : 'w-24 h-36';

    return (
        <div className={`card-container ${sizeClasses}`}>
            <div className="game-card game-card-back w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border border-zinc-700 rotate-45 opacity-40" />
                </div>
            </div>
        </div>
    );
};