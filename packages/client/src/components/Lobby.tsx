import { FC, useState } from 'react';
import { Room, MIN_PLAYERS } from '@coup/shared';

interface LobbyProps {
    room: Room;
    playerId: string;
    onToggleReady: () => void;
    onStartGame: () => void;
    onLeaveRoom: () => void;
}

export const Lobby: FC<LobbyProps> = ({
    room,
    playerId,
    onToggleReady,
    onStartGame,
    onLeaveRoom,
}) => {
    const [copied, setCopied] = useState(false);

    const isHost = room.hostId === playerId;
    const myPlayer = room.players.find(p => p.id === playerId);
    const allReady = room.players.every(p => p.isReady || p.id === room.hostId);
    const canStart = room.players.length >= MIN_PLAYERS && allReady;

    const copyRoomCode = () => {
        navigator.clipboard.writeText(room.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel p-8 max-w-md w-full animate-scale-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4 tracking-tight">GAME LOBBY</h1>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">Room Code</span>
                    </div>
                    <button
                        onClick={copyRoomCode}
                        className="font-mono text-3xl tracking-wider mt-2 px-4 py-2 rounded-xl bg-coup-card-hover border border-coup-border hover:border-white transition-all active:scale-95"
                    >
                        {room.id}
                    </button>
                    {copied && (
                        <p className="text-green-400 text-xs mt-2 animate-fade-in">
                            ✓ Copied to clipboard
                        </p>
                    )}
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Players
                        </h2>
                        <span className="text-xs text-gray-600">
                            {room.players.length}/{room.maxPlayers}
                        </span>
                    </div>
                    {room.players.map((player, index) => (
                        <div
                            key={player.id}
                            className="flex items-center justify-between p-4 bg-coup-card-hover rounded-xl border border-coup-border hover:border-coup-border-light transition-all animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                                <span className={`font-medium ${player.id === playerId ? 'text-white' : 'text-gray-400'}`}>
                                    {player.name}
                                </span>
                                {player.id === room.hostId && (
                                    <span className="text-[10px] bg-white text-black px-2 py-1 rounded-md font-medium">
                                        HOST
                                    </span>
                                )}
                            </div>
                            <div>
                                {player.id === room.hostId ? (
                                    <span className="text-gray-700 text-sm">—</span>
                                ) : player.isReady ? (
                                    <span className="text-green-400 text-sm font-medium">✓ Ready</span>
                                ) : (
                                    <span className="text-gray-600 text-sm">Waiting</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    {isHost ? (
                        <button
                            onClick={onStartGame}
                            disabled={!canStart}
                            className="btn-primary w-full py-4"
                        >
                            {room.players.length < MIN_PLAYERS
                                ? `Need ${MIN_PLAYERS - room.players.length} more player${MIN_PLAYERS - room.players.length > 1 ? 's' : ''}`
                                : !allReady
                                    ? 'Waiting for players...'
                                    : 'Start Game'}
                        </button>
                    ) : (
                        <button
                            onClick={onToggleReady}
                            className={`w-full py-4 ${myPlayer?.isReady ? 'btn-secondary' : 'btn-primary'}`}
                        >
                            {myPlayer?.isReady ? 'Not Ready' : 'Ready'}
                        </button>
                    )}

                    <button onClick={onLeaveRoom} className="btn-secondary w-full py-3">
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    );
};
