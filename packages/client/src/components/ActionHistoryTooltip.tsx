import { FC, useState } from 'react';
import { LogEntry } from '@coup/shared';

interface ActionHistoryTooltipProps {
    logs: LogEntry[];
    playerName: string;
}

export const ActionHistoryTooltip: FC<ActionHistoryTooltipProps> = ({ logs, playerName }) => {
    const [isOpen, setIsOpen] = useState(false);

    const playerLogs = logs
        .filter((log) => log.message.toLowerCase().includes(playerName.toLowerCase()))
        .slice(-5)
        .reverse();

    if (playerLogs.length === 0) return null;

    return (
        <div className="relative">
            <button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onClick={() => setIsOpen(!isOpen)}
                className="w-5 h-5 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
            >
                <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fade-in-up">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl min-w-[200px] max-w-[280px]">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2 font-medium">
                            Recent Actions
                        </div>
                        <div className="space-y-1.5">
                            {playerLogs.map((log) => (
                                <div key={log.id} className="text-xs text-zinc-400 leading-relaxed">
                                    {log.message}
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-zinc-700" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};