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
            <div className="glass-panel p-6 space-y-4 animate-scale-in">
                <p className="text-center text-gray-400 text-sm uppercase tracking-wide">
                    Select target for <span className="text-white font-medium">{selectingTarget}</span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {aliveOthers.map((player) => (
                        <button
                            key={player.id}
                            onClick={() => handleTargetSelect(player.id)}
                            className="btn-primary"
                            disabled={
                                (selectingTarget === ActionType.STEAL && player.coins === 0)
                            }
                        >
                            {player.name}
                            {selectingTarget === ActionType.STEAL && ` (${player.coins}●)`}
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
        <div className="glass-panel p-6 space-y-5 animate-fade-in-up">
            {mustCoup && (
                <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <span className="text-yellow-400 text-sm font-medium">⚠️ You must Coup (10+ coins)</span>
                </div>
            )}

            <div>
                <h3 className="text-xs text-gray-600 uppercase tracking-wide mb-3">Basic Actions</h3>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => handleActionClick(ActionType.INCOME)}
                        disabled={disabled || mustCoup}
                        className="btn-secondary py-4 flex flex-col items-center justify-center gap-1"
                    >
                        <span className="font-medium">Income</span>
                        <span className="text-xs text-gray-500">+1 coin</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.FOREIGN_AID)}
                        disabled={disabled || mustCoup}
                        className="btn-secondary py-4 flex flex-col items-center justify-center gap-1"
                    >
                        <span className="font-medium">Foreign Aid</span>
                        <span className="text-xs text-gray-500">+2 coins</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.COUP)}
                        disabled={disabled || !canAffordCoup}
                        className="btn-danger py-4 flex flex-col items-center justify-center gap-1"
                    >
                        <span className="font-medium">Coup</span>
                        <span className="text-xs opacity-90">-7 coins</span>
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xs text-gray-600 uppercase tracking-wide mb-3">Character Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleActionClick(ActionType.TAX)}
                        disabled={disabled || mustCoup}
                        className="btn-secondary py-4 flex flex-col items-center justify-center gap-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500"
                    >
                        <span className="font-medium">Tax</span>
                        <span className="text-[10px] text-gray-500">Duke • +3 coins</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.ASSASSINATE)}
                        disabled={disabled || mustCoup || !canAffordAssassinate}
                        className="btn-secondary py-4 flex flex-col items-center justify-center gap-1 border-gray-600/50 text-gray-400 hover:bg-gray-600/10 hover:border-gray-600"
                    >
                        <span className="font-medium">Assassinate</span>
                        <span className="text-[10px] text-gray-500">Assassin • -3 coins</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.STEAL)}
                        disabled={disabled || mustCoup || aliveOthers.every(p => p.coins === 0)}
                        className="btn-secondary py-4 flex flex-col items-center justify-center gap-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500"
                    >
                        <span className="font-medium">Steal</span>
                        <span className="text-[10px] text-gray-500">Captain • Take 2</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.EXCHANGE)}
                        disabled={disabled || mustCoup}
                        className="btn-secondary py-4 flex flex-col items-center justify-center gap-1 border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-500"
                    >
                        <span className="font-medium">Exchange</span>
                        <span className="text-[10px] text-gray-500">Ambassador • Swap</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
