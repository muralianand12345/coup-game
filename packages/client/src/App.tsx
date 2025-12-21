import { FC } from 'react';
import { Home } from './components/Home';
import { Lobby } from './components/Lobby';
import { useSocket } from './hooks/useSocket';
import { useGameStore } from './store/gameStore';
import { GameBoard } from './components/GameBoard';

const App: FC = () => {
    const {
        createRoom,
        joinRoom,
        leaveRoom,
        toggleReady,
        startGame,
        performAction,
        challenge,
        passChallenge,
        block,
        passBlock,
        loseInfluence,
        selectExchangeCards,
        sendChat,
    } = useSocket();

    const {
        playerId,
        room,
        gameState,
        chatMessages,
        timer,
        error,
    } = useGameStore();

    if (!room || !playerId) {
        return (
            <Home
                onCreateRoom={createRoom}
                onJoinRoom={joinRoom}
                error={error}
            />
        );
    }

    if (!room.isStarted || !gameState) {
        return (
            <Lobby
                room={room}
                playerId={playerId}
                onToggleReady={toggleReady}
                onStartGame={startGame}
                onLeaveRoom={leaveRoom}
            />
        );
    }

    return (
        <GameBoard
            gameState={gameState}
            playerId={playerId}
            timer={timer}
            chatMessages={chatMessages}
            onAction={performAction}
            onChallenge={challenge}
            onPass={gameState.phase === 'BLOCK_RESPONSE' ? passBlock : passChallenge}
            onBlock={block}
            onLoseInfluence={loseInfluence}
            onExchange={selectExchangeCards}
            onSendChat={sendChat}
            onLeaveRoom={leaveRoom}
        />
    );
};

export default App;
