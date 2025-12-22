import { FC, useState } from 'react';
import { ActionType, Player, ACTION_CONFIG } from '@coup/shared';
import { audioManager } from '../services/audio';

interface ActionButtonsProps {
    myPlayer: Player;
    otherPlayers: Player[];
    onAction: (action: ActionType, targetId?: string) => void;
    disabled: boolean;
}

interface ActionButtonProps {
    onClick: () => void;
    disabled: boolean;
    label: string;
    description: string;
    variant?: 'default' | 'danger' | 'violet' | 'sky' | 'emerald';
}

export const ActionButtons: FC<ActionButtonsProps> = ({ myPlayer, otherPlayers, onAction, disabled, }) => {
    const [selectingTarget, setSelectingTarget] = useState<ActionType | null>(null);
    const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);

    const mustCoup = myPlayer.coins >= 10;
    const canAffordCoup = myPlayer.coins >= 7;
    const canAffordAssassinate = myPlayer.coins >= 3;
    const aliveOthers = otherPlayers.filter((p) => p.isAlive);

    const handleActionClick = (action: ActionType) => {
        audioManager.play('click');
        const config = ACTION_CONFIG[action];
        if (config.targetRequired) {
            setSelectingTarget(action);
        } else {
            onAction(action);
        }
    };

    const handleTargetSelect = (targetId: string) => {
        audioManager.play('click');
        if (selectingTarget) {
            onAction(selectingTarget, targetId);
            setSelectingTarget(null);
        }
    };

    const handleCancel = () => {
        audioManager.play('click');
        setSelectingTarget(null);
    };

    if (selectingTarget) {
        const actionLabels: Record<string, { label: string; color: string }> = {
            [ActionType.COUP]: { label: 'Coup', color: 'red' },
            [ActionType.ASSASSINATE]: { label: 'Assassinate', color: 'zinc' },
            [ActionType.STEAL]: { label: 'Steal from', color: 'sky' },
        };
        const config = actionLabels[selectingTarget] || { label: selectingTarget, color: 'zinc' };

        return (
            <div className="glass-panel p-4 sm:p-6 animate-scale-in">
                <div className="text-center mb-6">
                    <p className="text-zinc-500 text-sm">
                        Select target for{' '}
                        <span className={`font-semibold ${config.color === 'red' ? 'text-red-400' : config.color === 'sky' ? 'text-sky-400' : 'text-zinc-100'}`}>
                            {config.label}
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {aliveOthers.map((player, index) => {
                        const isDisabled = selectingTarget === ActionType.STEAL && player.coins === 0;
                        const isHovered = hoveredTarget === player.id;

                        return (
                            <button
                                key={player.id}
                                onClick={() => !isDisabled && handleTargetSelect(player.id)}
                                onMouseEnter={() => setHoveredTarget(player.id)}
                                onMouseLeave={() => setHoveredTarget(null)}
                                disabled={isDisabled}
                                className={`
                                    relative p-4 sm:p-5 rounded-xl border transition-all duration-200
                                    flex items-center gap-3 min-h-[72px] touch-manipulation
                                    ${isDisabled ? 'opacity-40 cursor-not-allowed bg-zinc-900/30 border-zinc-800/30' : ''}
                                    ${!isDisabled ? 'bg-zinc-900/60 border-zinc-700/50 hover:bg-zinc-800/80 hover:border-zinc-600 active:scale-[0.98]' : ''}
                                    ${isHovered && !isDisabled ? 'ring-2 ring-amber-500/40 border-amber-500/30' : ''}
                                    animate-fade-in-up
                                `}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold
                                    ${isHovered && !isDisabled ? 'bg-amber-500 text-zinc-900' : 'bg-zinc-800 text-zinc-400'}
                                    transition-all duration-200
                                `}>
                                    {player.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 text-left">
                                    <span className="font-medium text-zinc-200 block">{player.name}</span>
                                    {selectingTarget === ActionType.STEAL && (
                                        <span className={`text-xs ${player.coins > 0 ? 'text-amber-400' : 'text-zinc-600'}`}>
                                            {player.coins} coin{player.coins !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                                {!isDisabled && (
                                    <svg className={`w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1 text-amber-400' : 'text-zinc-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button onClick={handleCancel} className="btn-secondary w-full py-4 min-h-[52px] touch-manipulation">
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-4 sm:p-6 animate-fade-in-up">
            {mustCoup && (
                <div className="mb-5 p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <span className="text-amber-400 text-sm flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        You have 10+ coins — you must Coup
                    </span>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xs text-zinc-600 uppercase tracking-wider mb-3 font-medium">
                    Basic Actions
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <ActionButton
                        onClick={() => handleActionClick(ActionType.INCOME)}
                        disabled={disabled || mustCoup}
                        label="Income"
                        description="+1 coin"
                    />
                    <ActionButton
                        onClick={() => handleActionClick(ActionType.FOREIGN_AID)}
                        disabled={disabled || mustCoup}
                        label="Foreign Aid"
                        description="+2 coins"
                    />
                    <ActionButton
                        onClick={() => handleActionClick(ActionType.COUP)}
                        disabled={disabled || !canAffordCoup}
                        label="Coup"
                        description="-7 coins"
                        variant="danger"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-xs text-zinc-600 uppercase tracking-wider mb-3 font-medium">
                    Character Actions
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <ActionButton
                        onClick={() => handleActionClick(ActionType.TAX)}
                        disabled={disabled || mustCoup}
                        label="Tax"
                        description="Duke · +3 coins"
                        variant="violet"
                    />
                    <ActionButton
                        onClick={() => handleActionClick(ActionType.ASSASSINATE)}
                        disabled={disabled || mustCoup || !canAffordAssassinate}
                        label="Assassinate"
                        description="Assassin · -3 coins"
                    />
                    <ActionButton
                        onClick={() => handleActionClick(ActionType.STEAL)}
                        disabled={disabled || mustCoup || aliveOthers.every((p) => p.coins === 0)}
                        label="Steal"
                        description="Captain · Take 2"
                        variant="sky"
                    />
                    <ActionButton
                        onClick={() => handleActionClick(ActionType.EXCHANGE)}
                        disabled={disabled || mustCoup}
                        label="Exchange"
                        description="Ambassador · Swap"
                        variant="emerald"
                    />
                </div>
            </div>
        </div>
    );
};

const ActionButton: FC<ActionButtonProps> = ({ onClick, disabled, label, description, variant = 'default' }) => {
    const variantClasses = {
        default: 'border-zinc-700/50 hover:border-zinc-600',
        danger: 'border-red-500/30 hover:border-red-500/50',
        violet: 'border-violet-500/30 hover:border-violet-500/50',
        sky: 'border-sky-500/30 hover:border-sky-500/50',
        emerald: 'border-emerald-500/30 hover:border-emerald-500/50',
    };

    const labelClasses = {
        default: 'text-zinc-300',
        danger: 'text-red-400',
        violet: 'text-violet-400',
        sky: 'text-sky-400',
        emerald: 'text-emerald-400',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                relative px-3 py-4 sm:px-4 sm:py-5 font-medium rounded-xl overflow-hidden
                flex flex-col items-center justify-center gap-1
                bg-zinc-900/60 border transition-all duration-200
                min-h-[80px] sm:min-h-[88px] touch-manipulation
                ${variantClasses[variant]}
                hover:bg-zinc-800/80 active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-900/60
            `}
        >
            <span className={`font-medium text-sm sm:text-base ${labelClasses[variant]}`}>{label}</span>
            <span className="text-[10px] sm:text-xs text-zinc-500 leading-tight">{description}</span>
        </button>
    );
};
