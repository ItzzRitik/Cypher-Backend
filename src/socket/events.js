import chalk from 'chalk';
import _ from 'lodash';

import { endSession, isAuthenticated, getBasicUserData } from '../utils';

const setupSocketEvents = (io) => {
	io.use((client, next) => {
		next();
	});

	io.on('connection', async (socket) => {
		socket.on('disconnect', () => {
			console.log(true, 'Disconnected Client Socket ID:', chalk.red(socket.id));
		});

		const query = socket?.handshake?.query,
			app = query?.app && JSON.parse(query?.app);

		if (app) {
			const userID = socket?.request?.session?.passport?.user;
			socket.join(app.id);

			socket.on('getSession', async (done) => {
				const user = await getBasicUserData(userID),
					isAuth = isAuthenticated(socket.request);

				return done({ isAuth, user });
			});

			socket.on('logout', () => {
				endSession(socket.request, app.id);
			});
		}
	});
};

export { setupSocketEvents };
