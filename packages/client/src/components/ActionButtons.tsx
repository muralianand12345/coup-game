import { FC, useState } from 'react';
import { ActionType, Player, ACTION_CONFIG } from '@coup/shared';

interface ActionButtonsProps {
    myPlayer: Player;
    otherPlayers: Player[];
    onAction: (action: ActionType, targetId?: string) => void;
    disabled: boolean;
}

const actionConfig = {
    [ActionType.INCOME]: { label: 'Income', desc: '+1 coin', color: 'zinc' },
    [ActionType.FOREIGN_AID]: { label: 'Foreign Aid', desc: '+2 coins', color: 'zinc' },
    [ActionType.COUP]: { label: 'Coup', desc: '-7 coins', color: 'red' },
    [ActionType.TAX]: { label: 'Tax', desc: 'Duke · +3', color: 'violet' },
    [ActionType.ASSASSINATE]: { label: 'Assassinate', desc: 'Assassin · -3', color: 'zinc' },
    [ActionType.STEAL]: { label: 'Steal', desc: 'Captain · +2', color: 'sky' },
    [ActionType.EXCHANGE]: { label: 'Exchange', desc: 'Ambassador', color: 'emerald' },
};

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
        const config = actionConfig[selectingTarget];
        return (
            <div className="glass-panel p-6 animate-scale-in">
                <div className="text-center mb-6">
                    <p className="text-zinc-500 text-sm">
                        Select target for <span className="text-zinc-100 font-medium">{config.label}</span>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    {aliveOthers.map((player, index) => {
                        const isDisabled = selectingTarget === ActionType.STEAL && player.coins === 0;
                        return (
                            <button
                                key={player.id}
                                onClick={() => handleTargetSelect(player.id)}
                                disabled={isDisabled}
                                className="btn-action animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <span className="font-medium">{player.name}</span>
                                {selectingTarget === ActionType.STEAL && (
                                    <span className="text-xs text-amber-400">{player.coins} coins</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setSelectingTarget(null)}
                    className="btn-secondary w-full py-3"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 animate-fade-in-up">
            {mustCoup && (
                <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <span className="text-amber-400 text-sm">
                        ⚠️ You have 10+ coins — you must Coup
                    </span>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xs text-zinc-600 uppercase tracking-wider mb-3 font-medium">
                    Basic Actions
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => handleActionClick(ActionType.INCOME)}
                        disabled={disabled || mustCoup}
                        className="btn-action"
                    >
                        <span className="font-medium">Income</span>
                        <span className="text-xs text-zinc-500">+1 coin</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.FOREIGN_AID)}
                        disabled={disabled || mustCoup}
                        className="btn-action"
                    >
                        <span className="font-medium">Foreign Aid</span>
                        <span className="text-xs text-zinc-500">+2 coins</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.COUP)}
                        disabled={disabled || !canAffordCoup}
                        className="btn-action border-red-500/30 hover:border-red-500/50"
                    >
                        <span className="font-medium text-red-400">Coup</span>
                        <span className="text-xs text-red-400/70">-7 coins</span>
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xs text-zinc-600 uppercase tracking-wider mb-3 font-medium">
                    Character Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleActionClick(ActionType.TAX)}
                        disabled={disabled || mustCoup}
                        className="btn-action border-violet-500/30 hover:border-violet-500/50"
                    >
                        <span className="font-medium text-violet-400">Tax</span>
                        <span className="text-xs text-zinc-500">Duke · +3 coins</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.ASSASSINATE)}
                        disabled={disabled || mustCoup || !canAffordAssassinate}
                        className="btn-action border-zinc-600/30 hover:border-zinc-500/50"
                    >
                        <span className="font-medium text-zinc-300">Assassinate</span>
                        <span className="text-xs text-zinc-500">Assassin · -3 coins</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.STEAL)}
                        disabled={disabled || mustCoup || aliveOthers.every(p => p.coins === 0)}
                        className="btn-action border-sky-500/30 hover:border-sky-500/50"
                    >
                        <span className="font-medium text-sky-400">Steal</span>
                        <span className="text-xs text-zinc-500">Captain · Take 2</span>
                    </button>

                    <button
                        onClick={() => handleActionClick(ActionType.EXCHANGE)}
                        disabled={disabled || mustCoup}
                        className="btn-action border-emerald-500/30 hover:border-emerald-500/50"
                    >
                        <span className="font-medium text-emerald-400">Exchange</span>
                        <span className="text-xs text-zinc-500">Ambassador · Swap</span>
                    </button>
                </div>
            </div>
        </div>
    );
};