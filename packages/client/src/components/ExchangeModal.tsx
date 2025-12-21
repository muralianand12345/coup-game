import { FC, useState } from 'react';
import { Card as CardType } from '@coup/shared';
import { Card } from './Card';

interface ExchangeModalProps {
    cards: CardType[];
    keepCount: number;
    onConfirm: (keepCardIds: string[]) => void;
}

export const ExchangeModal: FC<ExchangeModalProps> = ({
    cards,
    keepCount,
    onConfirm,
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleCard = (cardId: string) => {
        setSelectedIds(prev => {
            if (prev.includes(cardId)) {
                return prev.filter(id => id !== cardId);
            }
            if (prev.length < keepCount) {
                return [...prev, cardId];
            }
            return prev;
        });
    };

    const canConfirm = selectedIds.length === keepCount;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-coup-card border-2 border-coup-border rounded-lg p-6 max-w-lg w-full mx-4">
                <h2 className="text-xl font-bold text-center mb-4">
                    Exchange Cards
                </h2>
                <p className="text-center text-gray-400 mb-6">
                    Select {keepCount} card{keepCount > 1 ? 's' : ''} to keep:
                </p>
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            faceUp={true}
                            selected={selectedIds.includes(card.id)}
                            onClick={() => toggleCard(card.id)}
                        />
                    ))}
                </div>
                <div className="text-center">
                    <button
                        onClick={() => onConfirm(selectedIds)}
                        disabled={!canConfirm}
                        className="btn-primary"
                    >
                        Confirm Selection ({selectedIds.length}/{keepCount})
                    </button>
                </div>
            </div>
        </div>
    );
};
