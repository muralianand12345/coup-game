import { FC, useState } from 'react';

interface HomeProps {
    onCreateRoom: (playerName: string) => Promise<boolean>;
    onJoinRoom: (roomId: string, playerName: string) => Promise<boolean>;
    error: string | null;
}

export const Home: FC<HomeProps> = ({ onCreateRoom, onJoinRoom, error }) => {
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!playerName.trim()) return;
        setLoading(true);
        await onCreateRoom(playerName.trim());
        setLoading(false);
    };

    const handleJoin = async () => {
        if (!playerName.trim() || !roomCode.trim()) return;
        setLoading(true);
        await onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel p-10 max-w-md w-full animate-scale-in">
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-bold mb-3 tracking-tight">COUP</h1>
                    <p className="text-gray-500 text-sm tracking-wide">ONLINE MULTIPLAYER</p>
                </div>

                {error && (
                    <div className="bg-red-950/50 border border-red-800/50 text-red-400 p-4 rounded-xl mb-6 text-center text-sm animate-fade-in-up">
                        {error}
                    </div>
                )}

                {mode === 'menu' && (
                    <div className="space-y-3 animate-fade-in-up">
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
                    </div>
                )}

                {mode === 'create' && (
                    <div className="space-y-5 animate-fade-in-up">
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Your Name</label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name"
                                className="input-field w-full"
                                maxLength={20}
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={!playerName.trim() || loading}
                            className="btn-primary w-full py-4"
                        >
                            {loading ? 'Creating...' : 'Create Room'}
                        </button>
                        <button
                            onClick={() => setMode('menu')}
                            className="btn-secondary w-full py-3"
                        >
                            Back
                        </button>
                    </div>
                )}

                {mode === 'join' && (
                    <div className="space-y-5 animate-fade-in-up">
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Your Name</label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name"
                                className="input-field w-full"
                                maxLength={20}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Room Code</label>
                            <input
                                type="text"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                placeholder="XXXXX"
                                className="input-field w-full font-mono text-center text-2xl tracking-[0.5em] uppercase"
                                maxLength={5}
                            />
                        </div>
                        <button
                            onClick={handleJoin}
                            disabled={!playerName.trim() || !roomCode.trim() || loading}
                            className="btn-primary w-full py-4"
                        >
                            {loading ? 'Joining...' : 'Join Room'}
                        </button>
                        <button
                            onClick={() => setMode('menu')}
                            className="btn-secondary w-full py-3"
                        >
                            Back
                        </button>
                    </div>
                )}

                <div className="mt-10 text-center text-xs text-gray-600 space-y-1">
                    <p>2-6 Players</p>
                    <p className="text-gray-700">Bluff • Deceive • Survive</p>
                </div>
            </div>
        </div>
    );
};
