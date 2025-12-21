import { FC, useState } from 'react';
import { ActionType, Player, ACTION_CONFIG } from '@coup/shared';

interface ActionButtonsProps {
    myPlayer: Player;
    otherPlayers: Player[];
    onAction: (action: ActionType, targetId?: string) => void;
    disabled: boolean;
}

export const ActionButtons: FC<ActionButtonsProps> = ({
    myPlayer,
    otherPlayers,
    onAction,
    disabled,
}) => {
    const [selectingTarget, setSelectingTarget] = useState<ActionType | null>(null);

    const mustCoup = myPlayer.coins >= 10;
    const canAffordCoup = myPlayer.coins >= 7;
    const canAffordAssassinate = myPlayer.coins >= 3;

    const aliveOthers = otherPlayers.filter(p => p.isAlive);

    const handleActionClick = (action: ActionType) => {
        const config = ACTION_CONFIG[action];
        if (config.targetRequired) {
            setSelectingTarget(action);
        } else {
            onAction(action);
        }
    };

    const handleTargetSelect = (targetId: string) => {
        if (selectingTarget) {
            onAction(selectingTarget, targetId);
            setSelectingTarget(null);
        }
    };

    if (selectingTarget) {
        return (
            <div className="space-y-3">
                <p className="text-center text-gray-400">
                    Select target for {selectingTarget}:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {aliveOthers.map((player) => (
                        <button
                            key={player.id}
                            onClick={() => handleTargetSelect(player.id)}
                            className="btn-secondary"
                            disabled={
                                (selectingTarget === ActionType.STEAL && player.coins === 0)
                            }
                        >
                            {player.name}
                            {selectingTarget === ActionType.STEAL && ` (${player.coins}💰)`}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setSelectingTarget(null)}
                    className="btn-secondary w-full"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {mustCoup ? (
                <div className="text-center mb-2 text-yellow-400">
                    You must Coup (10+ coins)
                </div>
            ) : null}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                    onClick={() => handleActionClick(ActionType.INCOME)}
                    disabled={disabled || mustCoup}
                    className="btn-secondary text-sm py-3"
                >
                    Income
                    <span className="block text-xs text-gray-400">+1 coin</span>
                </button>

                <button
                    onClick={() => handleActionClick(ActionType.FOREIGN_AID)}
                    disabled={disabled || mustCoup}
                    className="btn-secondary text-sm py-3"
                >
                    Foreign Aid
                    <span className="block text-xs text-gray-400">+2 coins</span>
                </button>

                <button
                    onClick={() => handleActionClick(ActionType.COUP)}
                    disabled={disabled || !canAffordCoup}
                    className="btn-danger text-sm py-3"
                >
                    Coup
                    <span className="block text-xs text-gray-300">-7 coins</span>
                </button>

                <button
                    onClick={() => handleActionClick(ActionType.TAX)}
                    disabled={disabled || mustCoup}
                    className="btn-secondary text-sm py-3 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                >
                    Tax (Duke)
                    <span className="block text-xs opacity-70">+3 coins</span>
                </button>

                <button
                    onClick={() => handleActionClick(ActionType.ASSASSINATE)}
                    disabled={disabled || mustCoup || !canAffordAssassinate}
                    className="btn-secondary text-sm py-3 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                >
                    Assassinate
                    <span className="block text-xs opacity-70">-3 coins</span>
                </button>

                <button
                    onClick={() => handleActionClick(ActionType.STEAL)}
                    disabled={disabled || mustCoup || aliveOthers.every(p => p.coins === 0)}
                    className="btn-secondary text-sm py-3 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                >
                    Steal (Captain)
                    <span className="block text-xs opacity-70">Take 2 coins</span>
                </button>

                <button
                    onClick={() => handleActionClick(ActionType.EXCHANGE)}
                    disabled={disabled || mustCoup}
                    className="btn-secondary text-sm py-3 border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                >
                    Exchange
                    <span className="block text-xs opacity-70">Ambassador</span>
                </button>
            </div>
        </div>
    );
};
