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

export const ResponsePanel: FC<ResponsePanelProps> = ({
    gameState,
    playerId,
    timer,
    onChallenge,
    onPass,
    onBlock,
}) => {
    const { phase, pendingAction, pendingBlock, players } = gameState;

    const getPlayerName = (id: string) =>
        players.find(p => p.id === id)?.name || 'Unknown';

    const isActingPlayer = pendingAction?.playerId === playerId;
    const isBlockingPlayer = pendingBlock?.playerId === playerId;
    const isTarget = pendingAction?.targetId === playerId;

    if (phase === GamePhase.ACTION_RESPONSE && pendingAction) {
        if (isActingPlayer) {
            return (
                <div className="p-4 bg-coup-card rounded-lg border border-coup-border">
                    <p className="text-center text-gray-400">
                        Waiting for other players to respond...
                    </p>
                    <div className="text-center mt-2">
                        <span className="text-2xl font-mono">{timer}s</span>
                    </div>
                </div>
            );
        }

        const canChallenge = pendingAction.canBeChallenged;
        const canBlock = pendingAction.canBeBlocked &&
            (isTarget || pendingAction.blockableBy.includes(CardType.DUKE));

        return (
            <div className="p-4 bg-coup-card rounded-lg border border-coup-border space-y-4">
                <div className="text-center">
                    <p className="text-lg">
                        <span className="font-bold">{getPlayerName(pendingAction.playerId)}</span>
                        {' is attempting '}
                        <span className="text-yellow-400">{pendingAction.type}</span>
                        {pendingAction.targetId && (
                            <span>
                                {' on '}
                                <span className="font-bold">{getPlayerName(pendingAction.targetId)}</span>
                            </span>
                        )}
                    </p>
                    <div className="text-2xl font-mono mt-2">{timer}s</div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {canChallenge && (
                        <button onClick={onChallenge} className="btn-danger">
                            Challenge (claim: {pendingAction.requiredCard})
                        </button>
                    )}

                    {canBlock && pendingAction.blockableBy.map(cardType => (
                        <button
                            key={cardType}
                            onClick={() => onBlock(cardType)}
                            className="btn-secondary"
                        >
                            Block with {CARD_INFO[cardType].name}
                        </button>
                    ))}

                    <button onClick={onPass} className="btn-secondary">
                        Pass
                    </button>
                </div>
            </div>
        );
    }

    if (phase === GamePhase.BLOCK_RESPONSE && pendingBlock) {
        if (isBlockingPlayer) {
            return (
                <div className="p-4 bg-coup-card rounded-lg border border-coup-border">
                    <p className="text-center text-gray-400">
                        Waiting for others to accept or challenge your block...
                    </p>
                    <div className="text-center mt-2">
                        <span className="text-2xl font-mono">{timer}s</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4 bg-coup-card rounded-lg border border-coup-border space-y-4">
                <div className="text-center">
                    <p className="text-lg">
                        <span className="font-bold">{getPlayerName(pendingBlock.playerId)}</span>
                        {' blocks with '}
                        <span className="text-yellow-400">{pendingBlock.claimedCard}</span>
                    </p>
                    <div className="text-2xl font-mono mt-2">{timer}s</div>
                </div>

                <div className="flex gap-2 justify-center">
                    <button onClick={onChallenge} className="btn-danger">
                        Challenge Block
                    </button>
                    <button onClick={onPass} className="btn-secondary">
                        Accept Block
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
