import { FC } from 'react';
import { Card as CardType } from '@coup/shared';
import { Card } from './Card';

interface LoseInfluenceModalProps {
    cards: CardType[];
    onSelectCard: (cardId: string) => void;
}

export const LoseInfluenceModal: FC<LoseInfluenceModalProps> = ({
    cards,
    onSelectCard,
}) => {
    const unrevealedCards = cards.filter(c => !c.isRevealed);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-coup-card border-2 border-coup-border rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold text-center mb-4 text-red-400">
                    You must lose an influence!
                </h2>
                <p className="text-center text-gray-400 mb-6">
                    Select a card to reveal:
                </p>
                <div className="flex gap-4 justify-center">
                    {unrevealedCards.map((card) => (
                        <div key={card.id} className="cursor-pointer hover:scale-105 transition-transform">
                            <Card
                                card={card}
                                faceUp={true}
                                onClick={() => onSelectCard(card.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
