import { FC, useState } from 'react';
import { Player, LogEntry } from '@coup/shared';
import { PlayerInfo } from './PlayerInfo';

interface MobilePlayerDrawerProps {
    players: Player[];
    currentPlayerId: string;
    myPlayerId: string;
    logs: LogEntry[];
}

export const MobilePlayerDrawer: FC<MobilePlayerDrawerProps> = ({
    players,
    currentPlayerId,
    myPlayerId,
    logs,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const otherPlayers = players.filter((p) => p.id !== myPlayerId);
    const alivePlayers = otherPlayers.filter((p) => p.isAlive);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed left-4 top-20 z-40 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-sm"
            >
                <div className="flex -space-x-2">
                    {alivePlayers.slice(0, 3).map((player) => (
                        <div
                            key={player.id}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold border-2 border-zinc-900
                                ${currentPlayerId === player.id ? 'bg-amber-500 text-zinc-900' : 'bg-zinc-700 text-zinc-300'}
                            `}
                        >
                            {player.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                </div>
                <span className="text-xs text-zinc-400">{alivePlayers.length} players</span>
                <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-zinc-950 border-r border-zinc-800 animate-slide-in-left overflow-y-auto">
                        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Players</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            {otherPlayers.map((player) => (
                                <PlayerInfo
                                    key={player.id}
                                    player={player}
                                    isCurrentTurn={currentPlayerId === player.id}
                                    isYou={false}
                                    logs={logs}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
