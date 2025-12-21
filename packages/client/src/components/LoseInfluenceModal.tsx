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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="glass-panel p-8 max-w-md w-full mx-4 animate-scale-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 mb-4">
                        <span className="text-2xl">💀</span>
                    </div>
                    <h2 className="text-xl font-semibold text-red-400 mb-2">Lose Influence</h2>
                    <p className="text-zinc-500 text-sm">
                        Select a card to reveal
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    {unrevealedCards.map((card, index) => (
                        <div
                            key={card.id}
                            className="cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-card-enter"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
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