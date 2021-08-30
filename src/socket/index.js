import chalk from 'chalk';
import socketIO from 'socket.io';

import { CONSOLE_SUCCESS, isSocketInitialized, storeSocket } from '../utils';
import { setupSocketEvents } from './events';

const setupSocketIO = (server, session) => {
		const socket = socketIO(server, {
			allowEIO3: true,
			pingTimeout: 1000,
			cors: {
				origin: ['https://localhost:3000', 'https://192.168.1.100:3000', 'https://jarvis.ritik.dev'],
				credentials: true
			}
		});
		socket.use((socket, next) => session(socket.request, {}, next));

		return socket;
	},
	initSocketIO = (server, session) => {
		console.log(false, chalk.yellow('Starting SocketIO Service'));

		if (isSocketInitialized) {
			return;
		}

		const socket = setupSocketIO(server, session);

		storeSocket(socket);
		setupSocketEvents(socket);

		console.moveCursor(0, -1);
		console.log(CONSOLE_SUCCESS, chalk.green('SocketIO Service Established'));

		return socket;
	};
export default initSocketIO;
