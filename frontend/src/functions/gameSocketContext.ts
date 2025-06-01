import { createContext } from 'react';
import { Socket } from 'socket.io-client';

const GameSocketContext = createContext<{
  socket: Socket | null;
  setSocket: (socket: Socket) => void
  disconnect: () => void;
}>({
  setSocket: (socket: Socket) => void,
  socket: null,
  disconnect: () => {},
});

export default GameSocketContext;
