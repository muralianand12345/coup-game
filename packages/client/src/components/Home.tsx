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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-coup-card border-2 border-coup-border rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">COUP</h1>
          <p className="text-gray-400">Online Multiplayer</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {mode === 'menu' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="btn-primary w-full py-3 text-lg"
            >
              Create Room
            </button>
            <button
              onClick={() => setMode('join')}
              className="btn-secondary w-full py-3 text-lg"
            >
              Join Room
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input-field w-full"
                maxLength={20}
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!playerName.trim() || loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
            <button
              onClick={() => setMode('menu')}
              className="btn-secondary w-full"
            >
              Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input-field w-full"
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="input-field w-full font-mono text-center text-xl tracking-widest"
                maxLength={5}
              />
            </div>
            <button
              onClick={handleJoin}
              disabled={!playerName.trim() || !roomCode.trim() || loading}
              className="btn-primary w-full"
            >
              {loading ? 'Joining...' : 'Join Room'}
            </button>
            <button
              onClick={() => setMode('menu')}
              className="btn-secondary w-full"
            >
              Back
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>2-6 Players • Bluff & Deceive • Last one standing wins</p>
        </div>
      </div>
    </div>
  );
};
