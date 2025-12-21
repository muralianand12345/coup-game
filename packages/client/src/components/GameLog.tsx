import { FC, useRef, useEffect } from 'react';
import { LogEntry } from '@coup/shared';

interface GameLogProps {
    logs: LogEntry[];
}

const logTypeColors: Record<LogEntry['type'], string> = {
    action: 'text-white',
    challenge: 'text-yellow-400',
    block: 'text-blue-400',
    system: 'text-gray-500',
    elimination: 'text-red-400',
};

const logTypeIcons: Record<LogEntry['type'], string> = {
    action: '▸',
    challenge: '⚡',
    block: '🛡',
    system: '•',
    elimination: '💀',
};

export const GameLog: FC<GameLogProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="glass-panel h-64 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-coup-border">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Game Log</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {logs.length === 0 ? (
                    <div className="text-center text-gray-600 text-xs mt-8">
                        Game events will appear here
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div 
                            key={log.id} 
                            className={`${logTypeColors[log.type]} text-xs leading-relaxed flex gap-2 items-start animate-fade-in-up`}
                            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                        >
                            <span className="opacity-50 mt-0.5">{logTypeIcons[log.type]}</span>
                            <span className="flex-1">{log.message}</span>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
