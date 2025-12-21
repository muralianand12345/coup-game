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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-coup-card border-2 border-coup-border rounded-lg p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Game Lobby</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400">Room Code:</span>
            <button
              onClick={copyRoomCode}
              className="font-mono text-xl bg-coup-bg px-3 py-1 rounded border border-coup-border hover:border-white transition-colors"
            >
              {room.id}
            </button>
          </div>
          {copied && <p className="text-green-400 text-sm mt-1">Copied!</p>}
        </div>

        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-bold text-gray-400">
            Players ({room.players.length}/{room.maxPlayers})
          </h2>
          {room.players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-coup-bg rounded border border-coup-border"
            >
              <div className="flex items-center gap-2">
                <span className={player.id === playerId ? 'text-yellow-400' : ''}>
                  {player.name}
                </span>
                {player.id === room.hostId && (
                  <span className="text-xs bg-white text-black px-2 py-0.5 rounded">
                    HOST
                  </span>
                )}
              </div>
              <div>
                {player.id === room.hostId ? (
                  <span className="text-gray-500 text-sm">-</span>
                ) : player.isReady ? (
                  <span className="text-green-400">Ready ✓</span>
                ) : (
                  <span className="text-gray-500">Not Ready</span>
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
              className="btn-primary w-full"
            >
              {room.players.length < MIN_PLAYERS
                ? `Need ${MIN_PLAYERS - room.players.length} more player(s)`
                : !allReady
                ? 'Waiting for players...'
                : 'Start Game'}
            </button>
          ) : (
            <button
              onClick={onToggleReady}
              className={`w-full ${myPlayer?.isReady ? 'btn-secondary' : 'btn-primary'}`}
            >
              {myPlayer?.isReady ? 'Not Ready' : 'Ready'}
            </button>
          )}
          
          <button onClick={onLeaveRoom} className="btn-secondary w-full">
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};
