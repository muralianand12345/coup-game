import { FC, useState } from 'react';
import { Room, MIN_PLAYERS } from '@coup/shared';
import { SoundToggle } from './SoundToggle';
import { audioManager } from '../services/audio';

interface LobbyProps {
    room: Room;
    playerId: string;
    onToggleReady: () => void;
    onStartGame: () => void;
    onLeaveRoom: () => void;
}

export const Lobby: FC<LobbyProps> = ({ room, playerId, onToggleReady, onStartGame, onLeaveRoom }) => {
    const [copied, setCopied] = useState(false);

    const isHost = room.hostId === playerId;
    const myPlayer = room.players.find(p => p.id === playerId);
    const allReady = room.players.every(p => p.isReady || p.id === room.hostId);
    const canStart = room.players.length >= MIN_PLAYERS && allReady;

    const copyRoomCode = () => {
        audioManager.play('click');
        navigator.clipboard.writeText(room.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleReady = () => {
        audioManager.play('click');
        onToggleReady();
    };

    const handleStartGame = () => {
        audioManager.play('click');
        onStartGame();
    };

    const handleLeaveRoom = () => {
        audioManager.play('click');
        onLeaveRoom();
    };

    return (
        <div className="page-container min-h-screen flex items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
            </div>

            <div className="absolute top-4 right-4 z-20">
                <SoundToggle />
            </div>

            <div className="glass-panel p-8 max-w-lg w-full animate-scale-in relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight mb-6">Game Lobby</h1>

                    <div className="inline-flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Room Code</span>
                        <button
                            onClick={copyRoomCode}
                            className="group relative px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                        >
                            <span className="font-mono text-3xl tracking-[0.3em] text-zinc-100">
                                {room.id}
                            </span>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to copy
                            </span>
                        </button>
                        {copied && (
                            <span className="mt-8 text-emerald-400 text-xs animate-fade-in flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied to clipboard
                            </span>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                            Players
                        </span>
                        <span className="text-xs text-zinc-600">
                            {room.players.length} / {room.maxPlayers}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {room.players.map((player, index) => (
                            <div
                                key={player.id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 animate-fade-in-up ${player.id === playerId
                                    ? 'bg-zinc-900/80 border-zinc-700'
                                    : 'bg-zinc-900/40 border-zinc-800/50'
                                    }`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${player.id === playerId
                                        ? 'bg-zinc-100 text-zinc-900'
                                        : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-medium ${player.id === playerId ? 'text-zinc-100' : 'text-zinc-400'}`}>
                                            {player.name}
                                        </span>
                                        {player.id === room.hostId && (
                                            <span className="text-[10px] text-amber-400 uppercase tracking-wider">Host</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {player.id === room.hostId ? (
                                        <span className="text-zinc-600 text-xs">—</span>
                                    ) : player.isReady ? (
                                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                                            <div className="status-indicator active" />
                                            Ready
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-zinc-500 text-xs">
                                            <div className="status-indicator waiting" />
                                            Waiting
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="flex items-center justify-center p-4 rounded-xl border border-dashed border-zinc-800/50 text-zinc-700 text-sm"
                            >
                                Waiting for player...
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {isHost ? (
                        <button
                            onClick={handleStartGame}
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
                            onClick={handleToggleReady}
                            className={`w-full py-4 ${myPlayer?.isReady ? 'btn-secondary' : 'btn-primary'}`}
                        >
                            {myPlayer?.isReady ? 'Cancel Ready' : "I'm Ready"}
                        </button>
                    )}

                    <button onClick={handleLeaveRoom} className="btn-secondary w-full py-3 text-zinc-400">
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    );
};