import { Server } from 'socket.io';
import { CHALLENGE_TIMER_SECONDS } from '@coup/shared';

interface Timer {
  roomId: string;
  intervalId: NodeJS.Timeout;
  remaining: number;
  onExpire: () => void;
}

const timers: Map<string, Timer> = new Map();

export const startTimer = (
  io: Server,
  roomId: string,
  onExpire: () => void,
  duration: number = CHALLENGE_TIMER_SECONDS
): void => {
  stopTimer(roomId);
  
  const timer: Timer = {
    roomId,
    remaining: duration,
    onExpire,
    intervalId: setInterval(() => {
      const t = timers.get(roomId);
      if (!t) return;
      
      t.remaining -= 1;
      io.to(roomId).emit('timerUpdate', t.remaining);
      
      if (t.remaining <= 0) {
        stopTimer(roomId);
        onExpire();
      }
    }, 1000),
  };
  
  timers.set(roomId, timer);
  io.to(roomId).emit('timerUpdate', duration);
};

export const stopTimer = (roomId: string): void => {
  const timer = timers.get(roomId);
  if (timer) {
    clearInterval(timer.intervalId);
    timers.delete(roomId);
  }
};

export const getTimerRemaining = (roomId: string): number => {
  const timer = timers.get(roomId);
  return timer ? timer.remaining : 0;
};
