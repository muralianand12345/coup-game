import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { ClientToServerEvents, ServerToClientEvents } from '@coup/shared';
import { setupSocketHandlers } from './socket/handlers';
import { cleanupEmptyRooms, getRoomCount } from './room/manager';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, { cors: { origin: clientUrl, methods: ['GET', 'POST'], credentials: true } });

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: Date.now(), onlineCount: io.engine.clientsCount }));
app.get('/stats', (_req, res) => res.json({ onlineCount: io.engine.clientsCount, roomCount: getRoomCount(), timestamp: Date.now() }));

setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;

setInterval(() => {
	cleanupEmptyRooms();
	console.log(`Active rooms: ${getRoomCount()}, Online users: ${io.engine.clientsCount}`);
}, 60000);

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Accepting connections from: ${clientUrl}`);
});
