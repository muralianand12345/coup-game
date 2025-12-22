import { FC, useState } from 'react';
import { Card as CardType } from '@coup/shared';
import { Card } from './Card';

interface ExchangeModalProps {
    cards: CardType[];
    keepCount: number;
    onConfirm: (keepCardIds: string[]) => void;
}

export const ExchangeModal: FC<ExchangeModalProps> = ({ cards, keepCount, onConfirm }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleCard = (cardId: string) => {
        setSelectedIds(prev => {
            if (prev.includes(cardId)) return prev.filter(id => id !== cardId);
            if (prev.length < keepCount) return [...prev, cardId];
            return prev;
        });
    };

    const canConfirm = selectedIds.length === keepCount;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="glass-panel p-8 max-w-xl w-full mx-4 animate-scale-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 mb-4">
                        <span className="text-2xl">📜</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Exchange Cards</h2>
                    <p className="text-zinc-500 text-sm">
                        Select {keepCount} card{keepCount > 1 ? 's' : ''} to keep
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center mb-8">
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            className="animate-card-enter"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Card
                                card={card}
                                faceUp={true}
                                selected={selectedIds.includes(card.id)}
                                onClick={() => toggleCard(card.id)}
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={() => onConfirm(selectedIds)}
                        disabled={!canConfirm}
                        className="btn-primary px-8 py-3"
                    >
                        Confirm Selection ({selectedIds.length}/{keepCount})
                    </button>
                </div>
            </div>
        </div>
    );
};