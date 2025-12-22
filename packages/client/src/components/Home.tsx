import { FC, useState } from 'react';
import { Cheatsheet } from './Cheatsheet';
import { SoundToggle } from './SoundToggle';
import { audioManager } from '../services/audio';
import { version } from '../../../../package.json';
import { useOnlineStore } from '../store/onlineStore';

interface HomeProps {
    onCreateRoom: (playerName: string, onStatusChange?: (status: string) => void) => Promise<boolean>;
    onJoinRoom: (roomId: string, playerName: string, onStatusChange?: (status: string) => void) => Promise<boolean>;
    error: string | null;
}

const APP_VERSION = version;

export const Home: FC<HomeProps> = ({ onCreateRoom, onJoinRoom, error }) => {
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
    const [showCheatsheet, setShowCheatsheet] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
    const { onlineCount } = useOnlineStore();

    const handleCreate = async () => {
        if (!playerName.trim()) return;
        audioManager.play('click');
        setLoading(true);
        setConnectionStatus(null);
        await onCreateRoom(playerName.trim(), setConnectionStatus);
        setLoading(false);
        setConnectionStatus(null);
    };

    const handleJoin = async () => {
        if (!playerName.trim() || !roomCode.trim()) return;
        audioManager.play('click');
        setLoading(true);
        setConnectionStatus(null);
        await onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim(), setConnectionStatus);
        setLoading(false);
        setConnectionStatus(null);
    };

    const handleBack = () => {
        audioManager.play('click');
        setMode('menu');
        setPlayerName('');
        setRoomCode('');
        setConnectionStatus(null);
    };

    const handleModeChange = (newMode: 'create' | 'join') => {
        audioManager.play('click');
        setMode(newMode);
    };

    return (
        <div className="page-container min-h-screen flex items-center justify-center p-6">
            <Cheatsheet isOpen={showCheatsheet} onClose={() => setShowCheatsheet(false)} />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl" />
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
                <SoundToggle />
            </div>

            {onlineCount > 0 && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/50 backdrop-blur-sm z-20">
                    <div className="relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <span className="text-xs text-zinc-400">
                        <span className="text-emerald-400 font-medium">{onlineCount}</span> online
                    </span>
                </div>
            )}

            <div className="glass-panel p-10 max-w-md w-full animate-scale-in relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-float shadow-lg shadow-amber-500/20">
                            <span className="text-3xl">👑</span>
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
                            onClick={() => handleModeChange('create')}
                            className="btn-primary w-full py-4 text-base group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Create Room
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </span>
                        </button>
                        <button
                            onClick={() => handleModeChange('join')}
                            className="btn-secondary w-full py-4 text-base group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Join Room
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                audioManager.play('click');
                                setShowCheatsheet(true);
                            }}
                            className="w-full py-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            How to Play
                        </button>
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

                <div className="mt-10 pt-6 border-t border-zinc-800/50">
                    <div className="flex items-center justify-between text-[10px] text-zinc-600">
                        <span>v{APP_VERSION}</span>
                        <span>Made with ❤️ by Murali Anand</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
