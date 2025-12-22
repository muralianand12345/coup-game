import { FC, useState } from 'react';
import { CardType, ActionType, CARD_INFO } from '@coup/shared';

interface CheatsheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Cheatsheet: FC<CheatsheetProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'rules' | 'characters' | 'actions'>('rules');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="glass-panel max-w-3xl w-full max-h-[85vh] overflow-hidden animate-scale-in">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">📖</span>
                        <h2 className="text-lg font-semibold">Game Cheatsheet</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex border-b border-zinc-800/50">
                    {[
                        { id: 'rules', label: 'Rules', icon: '📜' },
                        { id: 'characters', label: 'Characters', icon: '🎭' },
                        { id: 'actions', label: 'Actions', icon: '⚡' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id
                                ? 'bg-zinc-800/50 text-zinc-100 border-b-2 border-amber-500'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6 custom-scrollbar">
                    {activeTab === 'rules' && <RulesTab />}
                    {activeTab === 'characters' && <CharactersTab />}
                    {activeTab === 'actions' && <ActionsTab />}
                </div>
            </div>
        </div>
    );
};

const RulesTab: FC = () => (
    <div className="space-y-6">
        <section>
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <span>🎯</span> Objective
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
                Be the last player with influence (cards) remaining. Eliminate other players by forcing them to lose both their cards.
            </p>
        </section>

        <section>
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <span>🃏</span> Setup
            </h3>
            <ul className="text-zinc-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    Each player starts with 2 cards (influence) and 2 coins
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    Cards are kept secret from other players
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    The deck contains 3 copies of each character (15 cards total)
                </li>
            </ul>
        </section>

        <section>
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <span>🔄</span> Turn Structure
            </h3>
            <ul className="text-zinc-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">1.</span>
                    On your turn, perform ONE action
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">2.</span>
                    Other players may challenge or block (if applicable)
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">3.</span>
                    If you have 10+ coins, you MUST Coup
                </li>
            </ul>
        </section>

        <section>
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <span>⚔️</span> Challenging
            </h3>
            <ul className="text-zinc-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    Any player can challenge another player's character claim
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    <span><strong className="text-zinc-300">If challenged correctly:</strong> The liar loses 1 influence</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    <span><strong className="text-zinc-300">If challenged incorrectly:</strong> The challenger loses 1 influence, and the truthful player gets a new card</span>
                </li>
            </ul>
        </section>

        <section>
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <span>🛡️</span> Blocking
            </h3>
            <ul className="text-zinc-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    Some actions can be blocked by specific characters
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    Blocks can be challenged just like actions
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-zinc-600">•</span>
                    You can bluff a block even without the card!
                </li>
            </ul>
        </section>

        <section>
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <span>💀</span> Losing Influence
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
                When you lose influence, you must reveal one of your cards face-up. Once both cards are revealed, you're eliminated from the game.
            </p>
        </section>
    </div>
);

const CharactersTab: FC = () => {
    const characters = Object.values(CardType).map((type) => ({ type, ...CARD_INFO[type] }));

    return (
        <div className="space-y-4">
            <p className="text-zinc-500 text-sm mb-4">
                Each character has a unique ability. You can claim to have any character, even if you don't!
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="text-left py-3 px-3 text-zinc-500 font-medium">Character</th>
                            <th className="text-left py-3 px-3 text-zinc-500 font-medium">Action</th>
                            <th className="text-left py-3 px-3 text-zinc-500 font-medium">Blocks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {characters.map((char) => (
                            <tr key={char.type} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                <td className="py-3 px-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{char.icon}</span>
                                        <span className="font-medium text-zinc-200">{char.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-3 text-zinc-400">{char.ability}</td>
                                <td className="py-3 px-3 text-zinc-400">{char.blockAbility || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ActionsTab: FC = () => {
    const actions = [
        {
            type: ActionType.INCOME,
            name: 'Income',
            description: 'Take 1 coin from the treasury',
            cost: 0,
            character: 'None',
            blockable: false,
            challengeable: false,
        },
        {
            type: ActionType.FOREIGN_AID,
            name: 'Foreign Aid',
            description: 'Take 2 coins from the treasury',
            cost: 0,
            character: 'None',
            blockable: true,
            blockedBy: 'Duke',
            challengeable: false,
        },
        {
            type: ActionType.COUP,
            name: 'Coup',
            description: 'Pay 7 coins, target loses 1 influence',
            cost: 7,
            character: 'None',
            blockable: false,
            challengeable: false,
        },
        {
            type: ActionType.TAX,
            name: 'Tax',
            description: 'Take 3 coins from the treasury',
            cost: 0,
            character: 'Duke',
            blockable: false,
            challengeable: true,
        },
        {
            type: ActionType.ASSASSINATE,
            name: 'Assassinate',
            description: 'Pay 3 coins, target loses 1 influence',
            cost: 3,
            character: 'Assassin',
            blockable: true,
            blockedBy: 'Contessa',
            challengeable: true,
        },
        {
            type: ActionType.STEAL,
            name: 'Steal',
            description: 'Take 2 coins from another player',
            cost: 0,
            character: 'Captain',
            blockable: true,
            blockedBy: 'Captain, Ambassador',
            challengeable: true,
        },
        {
            type: ActionType.EXCHANGE,
            name: 'Exchange',
            description: 'Draw 2 cards, return 2 to deck',
            cost: 0,
            character: 'Ambassador',
            blockable: false,
            challengeable: true,
        },
    ];

    return (
        <div className="space-y-4">
            <p className="text-zinc-500 text-sm mb-4">
                Actions marked with a character require (or claim to require) that character card.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="text-left py-3 px-3 text-zinc-500 font-medium">Action</th>
                            <th className="text-left py-3 px-3 text-zinc-500 font-medium">Cost</th>
                            <th className="text-left py-3 px-3 text-zinc-500 font-medium">Character</th>
                            <th className="text-left py-3 px-3 text-zinc-500 font-medium">Blocked By</th>
                            <th className="text-center py-3 px-3 text-zinc-500 font-medium">Challenge?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actions.map((action) => (
                            <tr key={action.type} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                <td className="py-3 px-3">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-zinc-200">{action.name}</span>
                                        <span className="text-xs text-zinc-500">{action.description}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-3">
                                    {action.cost > 0 ? (
                                        <span className="text-amber-400">{action.cost} coins</span>
                                    ) : (
                                        <span className="text-zinc-600">Free</span>
                                    )}
                                </td>
                                <td className="py-3 px-3">
                                    {action.character !== 'None' ? (
                                        <span className="text-violet-400">{action.character}</span>
                                    ) : (
                                        <span className="text-zinc-600">—</span>
                                    )}
                                </td>
                                <td className="py-3 px-3">
                                    {action.blockable ? (
                                        <span className="text-sky-400">{action.blockedBy}</span>
                                    ) : (
                                        <span className="text-zinc-600">—</span>
                                    )}
                                </td>
                                <td className="py-3 px-3 text-center">
                                    {action.challengeable ? (
                                        <span className="text-emerald-400">✓</span>
                                    ) : (
                                        <span className="text-zinc-600">✗</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <h4 className="text-amber-400 font-medium mb-2 flex items-center gap-2">
                    <span>💡</span> Pro Tips
                </h4>
                <ul className="text-zinc-400 text-sm space-y-1">
                    <li>• You can bluff ANY action, even if you don't have the card</li>
                    <li>• At 10+ coins, you MUST Coup - no other actions allowed</li>
                    <li>• Coup cannot be blocked or challenged</li>
                    <li>• Income cannot be blocked or challenged</li>
                </ul>
            </div>
        </div>
    );
};

export const CheatsheetButton: FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-all hover:scale-105"
        title="Game Rules & Cheatsheet"
    >
        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    </button>
);