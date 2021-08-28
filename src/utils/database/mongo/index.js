import mongoose from 'mongoose';
import chalk from 'chalk';

import { CONSOLE_SUCCESS, CONSOLE_ERROR, loader } from '../../';

let loading,
	mongoCall = 0;

const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true },
	connectMongoDB = (resolve, reject) => {
		mongoose.connect(process.env.DATABASE_URL, dbOptions)
			.then(() => {
				clearInterval(loading);
				console.stdout('\n');
				process.stdout.moveCursor(0, -1);
				console.log(CONSOLE_SUCCESS, chalk.green('Mongo Connection Established'));
				return resolve(mongoose.connection.client);
			})
			.catch((error) => {
				clearInterval(loading);
				++mongoCall > 1 && process.stdout.moveCursor(0, -1);

				console.stdout('\r');
				console.error(CONSOLE_ERROR, 'MongoDB Connection Failed: ', chalk.red(error),
					chalk.red.dim((mongoCall > 1) ? '(' + mongoCall + ')' : ''));

				if (mongoCall >= 1) {
					process.stdout.moveCursor(0, -1);
					console.stdout('\r\n');

					console.log(true, 'Failed to connect database');
					console.log(CONSOLE_ERROR, chalk.red(error));
					console.log(CONSOLE_ERROR, chalk.red('Stopping Server!\n\n'));
					return reject();
				}

				loading = loader('  Reconnecting');
				setTimeout(() => connectMongoDB(resolve, reject), 5000);
			});
	},

	initDatabase = () => {
		loading = loader(chalk.yellow('  Connecting to Mongo Server'));
		return new Promise(connectMongoDB);
	};

export { initDatabase };
