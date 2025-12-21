import { FC, useRef, useEffect } from 'react';
import { LogEntry } from '@coup/shared';

interface GameLogProps {
    logs: LogEntry[];
}

const logTypeColors: Record<LogEntry['type'], string> = {
    action: 'text-white',
    challenge: 'text-yellow-400',
    block: 'text-blue-400',
    system: 'text-gray-400',
    elimination: 'text-red-400',
};

export const GameLog: FC<GameLogProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="bg-coup-card border border-coup-border rounded-lg p-3 h-48 overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-400 mb-2">Game Log</h3>
            <div className="space-y-1 text-sm">
                {logs.map((log) => (
                    <div key={log.id} className={logTypeColors[log.type]}>
                        {log.message}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
