import { FC, useState } from 'react';
import { Cheatsheet } from './Cheatsheet';

interface HomeProps {
    onCreateRoom: (playerName: string, onStatusChange?: (status: string) => void) => Promise<boolean>;
    onJoinRoom: (roomId: string, playerName: string, onStatusChange?: (status: string) => void) => Promise<boolean>;
    error: string | null;
}

export const Home: FC<HomeProps> = ({ onCreateRoom, onJoinRoom, error }) => {
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
    const [showCheatsheet, setShowCheatsheet] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!playerName.trim()) return;
        setLoading(true);
        setConnectionStatus(null);
        await onCreateRoom(playerName.trim(), setConnectionStatus);
        setLoading(false);
        setConnectionStatus(null);
    };

    const handleJoin = async () => {
        if (!playerName.trim() || !roomCode.trim()) return;
        setLoading(true);
        setConnectionStatus(null);
        await onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim(), setConnectionStatus);
        setLoading(false);
        setConnectionStatus(null);
    };

    const handleBack = () => {
        setMode('menu');
        setPlayerName('');
        setRoomCode('');
        setConnectionStatus(null);
    };

    return (
        <div className="page-container min-h-screen flex items-center justify-center p-6">
            <Cheatsheet isOpen={showCheatsheet} onClose={() => setShowCheatsheet(false)} />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
            </div>

            <div className="glass-panel p-10 max-w-md w-full animate-scale-in relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-float">
                            <span className="text-2xl">👑</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-2">COUP</h1>
                    <p className="text-zinc-500 text-sm tracking-widest uppercase">Bluff · Deceive · Survive</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in-down">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}

                {mode === 'menu' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <button
                            onClick={() => setMode('create')}
                            className="btn-primary w-full py-4 text-base"
                        >
                            Create Room
                        </button>
                        <button
                            onClick={() => setMode('join')}
                            className="btn-secondary w-full py-4 text-base"
                        >
                            Join Room
                        </button>
                        <button
                            onClick={() => setShowCheatsheet(true)}
                            className="w-full py-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            How to Play
                        </button>

                        <div className="pt-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-zinc-800" />
                            <span className="text-zinc-600 text-xs uppercase tracking-wider">2-6 Players</span>
                            <div className="flex-1 h-px bg-zinc-800" />
                        </div>
                    </div>
                )}

                {mode === 'create' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div>
                            <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider font-medium">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name"
                                className="input-field"
                                maxLength={20}
                                autoFocus
                                disabled={loading}
                                onKeyDown={(e) => e.key === 'Enter' && !loading && handleCreate()}
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={!playerName.trim() || loading}
                            className="btn-primary w-full py-4"
                        >
                            {loading ? (
                                <span className="flex flex-col items-center justify-center gap-1">
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                                        {connectionStatus || 'Connecting...'}
                                    </span>
                                </span>
                            ) : 'Create Room'}
                        </button>
                        <button onClick={handleBack} disabled={loading} className="btn-secondary w-full py-3">
                            Back
                        </button>
                        {loading && connectionStatus && connectionStatus.includes('waking') && (
                            <p className="text-zinc-500 text-xs text-center animate-fade-in">
                                Free servers sleep after inactivity. This usually takes 30-60 seconds.
                            </p>
                        )}
                    </div>
                )}

                {mode === 'join' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div>
                            <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider font-medium">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name"
                                className="input-field"
                                maxLength={20}
                                autoFocus
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider font-medium">
                                Room Code
                            </label>
                            <input
                                type="text"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                placeholder="XXXXX"
                                className="input-field font-mono text-center text-2xl tracking-[0.4em] uppercase"
                                maxLength={5}
                                disabled={loading}
                                onKeyDown={(e) => e.key === 'Enter' && !loading && handleJoin()}
                            />
                        </div>
                        <button
                            onClick={handleJoin}
                            disabled={!playerName.trim() || !roomCode.trim() || loading}
                            className="btn-primary w-full py-4"
                        >
                            {loading ? (
                                <span className="flex flex-col items-center justify-center gap-1">
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                                        {connectionStatus || 'Connecting...'}
                                    </span>
                                </span>
                            ) : 'Join Room'}
                        </button>
                        <button onClick={handleBack} disabled={loading} className="btn-secondary w-full py-3">
                            Back
                        </button>
                        {loading && connectionStatus && connectionStatus.includes('waking') && (
                            <p className="text-zinc-500 text-xs text-center animate-fade-in">
                                Free servers sleep after inactivity. This usually takes 30-60 seconds.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};