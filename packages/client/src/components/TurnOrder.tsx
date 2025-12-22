import { FC } from 'react';
import { Player } from '@coup/shared';

interface TurnOrderProps {
    players: Player[];
    currentPlayerIndex: number;
    myPlayerId: string;
}

export const TurnOrder: FC<TurnOrderProps> = ({ players, currentPlayerIndex, myPlayerId }) => {
    return (
        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/50">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider mr-2">Turn Order</span>
            <div className="flex items-center">
                {players.map((player, index) => {
                    const isCurrentTurn = index === currentPlayerIndex;
                    const isMe = player.id === myPlayerId;
                    const isAlive = player.isAlive;

                    return (
                        <div key={player.id} className="flex items-center">
                            <div
                                className={`
                                    relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold
                                    transition-all duration-300
                                    ${!isAlive ? 'opacity-30 grayscale' : ''}
                                    ${isCurrentTurn ? 'bg-amber-500 text-zinc-900 scale-110 ring-2 ring-amber-500/50 ring-offset-1 ring-offset-zinc-950' : ''}
                                    ${!isCurrentTurn && isMe ? 'bg-zinc-100 text-zinc-900' : ''}
                                    ${!isCurrentTurn && !isMe && isAlive ? 'bg-zinc-800 text-zinc-400' : ''}
                                `}
                                title={`${player.name}${isMe ? ' (You)' : ''}${isCurrentTurn ? ' - Current Turn' : ''}`}
                            >
                                {player.name.charAt(0).toUpperCase()}
                                {isCurrentTurn && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                        <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-amber-500" />
                                    </div>
                                )}
                            </div>
                            {index < players.length - 1 && (
                                <div className={`w-3 h-0.5 mx-0.5 ${players[index + 1]?.isAlive && isAlive ? 'bg-zinc-700' : 'bg-zinc-800/50'}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
