import { LogEntry } from '@coup/shared';
import { FC, useRef, useEffect } from 'react';

interface GameLogProps {
    logs: LogEntry[];
}

const logTypeStyles: Record<LogEntry['type'], { color: string; icon: string }> = {
    action: { color: 'text-zinc-300', icon: '▸' },
    challenge: { color: 'text-amber-400', icon: '⚡' },
    block: { color: 'text-sky-400', icon: '◆' },
    system: { color: 'text-zinc-500', icon: '•' },
    elimination: { color: 'text-red-400', icon: '✕' },
};

export const GameLog: FC<GameLogProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="glass-panel flex flex-col h-64 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800/50">
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Game Log
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-600 text-xs">Events will appear here</p>
                    </div>
                ) : (
                    logs.map((log, index) => {
                        const style = logTypeStyles[log.type];
                        return (
                            <div
                                key={log.id}
                                className={`${style.color} text-xs leading-relaxed flex gap-2 items-start animate-fade-in-up`}
                                style={{ animationDelay: `${Math.min(index * 0.02, 0.2)}s` }}
                            >
                                <span className="opacity-50 mt-0.5 w-3 flex-shrink-0">{style.icon}</span>
                                <span className="flex-1">{log.message}</span>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};