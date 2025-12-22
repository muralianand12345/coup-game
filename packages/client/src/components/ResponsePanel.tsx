import { FC } from 'react';
import { GameState, GamePhase, CardType, CARD_INFO } from '@coup/shared';

interface ResponsePanelProps {
    gameState: GameState;
    playerId: string;
    timer: number;
    onChallenge: () => void;
    onPass: () => void;
    onBlock: (cardType: CardType) => void;
}

const TimerRing: FC<{ value: number; max?: number }> = ({ value, max = 30 }) => {
    const progress = (value / max) * 100;
    const isLow = value <= 10;

    return (
        <div
            className="timer-ring"
            style={{ '--progress': `${progress}%` } as React.CSSProperties}
        >
            <span className={`timer-value ${isLow ? 'text-red-400' : ''}`}>
                {value}
            </span>
        </div>
    );
};

export const ResponsePanel: FC<ResponsePanelProps> = ({ gameState, playerId, timer, onChallenge, onPass, onBlock }) => {
    const { phase, pendingAction, pendingBlock, players, passedPlayers = [] } = gameState;
    const hasPassed = passedPlayers.includes(playerId);

    const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown';

    const isActingPlayer = pendingAction?.playerId === playerId;
    const isBlockingPlayer = pendingBlock?.playerId === playerId;
    const isTarget = pendingAction?.targetId === playerId;

    if (phase === GamePhase.ACTION_RESPONSE && pendingAction) {
        if (isActingPlayer) {
            return (
                <div className="glass-panel p-6 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-zinc-400 text-sm">Waiting for responses...</p>
                            <p className="text-zinc-600 text-xs mt-1">Other players may challenge or block</p>
                        </div>
                        <TimerRing value={timer} />
                    </div>
                </div>
            );
        }

        const canChallenge = pendingAction.canBeChallenged;
        const canBlock = pendingAction.canBeBlocked && (isTarget || pendingAction.blockableBy.includes(CardType.DUKE));

        if (hasPassed) {
            return (
                <div className="glass-panel p-6 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-zinc-400 text-sm">You passed</p>
                            <p className="text-zinc-600 text-xs mt-1">Waiting for other players...</p>
                        </div>
                        <TimerRing value={timer} />
                    </div>
                </div>
            );
        }

        return (
            <div className="glass-panel p-6 animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-zinc-100">
                            <span className="font-semibold">{getPlayerName(pendingAction.playerId)}</span>
                            <span className="text-zinc-400"> attempts </span>
                            <span className="text-amber-400 font-medium">{pendingAction.type}</span>
                            {pendingAction.targetId && (
                                <span className="text-zinc-400">
                                    {' on '}
                                    <span className="text-zinc-100 font-medium">
                                        {getPlayerName(pendingAction.targetId)}
                                    </span>
                                </span>
                            )}
                        </p>
                        {pendingAction.requiredCard && (
                            <p className="text-zinc-500 text-xs mt-1">
                                Claims to have {pendingAction.requiredCard}
                            </p>
                        )}
                    </div>
                    <TimerRing value={timer} />
                </div>

                <div className="flex flex-wrap gap-2">
                    {canChallenge && (
                        <button onClick={onChallenge} className="btn-danger flex-1 min-w-[140px]">
                            Challenge
                        </button>
                    )}

                    {canBlock && pendingAction.blockableBy.map(cardType => (
                        <button
                            key={cardType}
                            onClick={() => onBlock(cardType)}
                            className="btn-secondary flex-1 min-w-[140px]"
                        >
                            Block ({CARD_INFO[cardType].name})
                        </button>
                    ))}

                    <button onClick={onPass} className="btn-secondary flex-1 min-w-[100px]">
                        Pass
                    </button>
                </div>
            </div>
        );
    }

    if (phase === GamePhase.BLOCK_RESPONSE && pendingBlock) {
        if (isBlockingPlayer) {
            return (
                <div className="glass-panel p-6 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-zinc-400 text-sm">Waiting for challenge response...</p>
                            <p className="text-zinc-600 text-xs mt-1">
                                You blocked with {pendingBlock.claimedCard}
                            </p>
                        </div>
                        <TimerRing value={timer} />
                    </div>
                </div>
            );
        }

        if (hasPassed) {
            return (
                <div className="glass-panel p-6 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-zinc-400 text-sm">You accepted the block</p>
                            <p className="text-zinc-600 text-xs mt-1">Waiting for other players...</p>
                        </div>
                        <TimerRing value={timer} />
                    </div>
                </div>
            );
        }

        return (
            <div className="glass-panel p-6 animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-zinc-100">
                            <span className="font-semibold">{getPlayerName(pendingBlock.playerId)}</span>
                            <span className="text-zinc-400"> blocks with </span>
                            <span className="text-sky-400 font-medium">{pendingBlock.claimedCard}</span>
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">
                            Challenge the block or accept it
                        </p>
                    </div>
                    <TimerRing value={timer} />
                </div>

                <div className="flex gap-2">
                    <button onClick={onChallenge} className="btn-danger flex-1">
                        Challenge Block
                    </button>
                    <button onClick={onPass} className="btn-secondary flex-1">
                        Accept Block
                    </button>
                </div>
            </div>
        );
    }

    return null;
};