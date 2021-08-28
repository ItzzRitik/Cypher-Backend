import expressJS from 'express';
import http from 'http';
import expressSession from 'express-session';
import chalk from 'chalk';
import ip from 'ip';
import cookieParser from 'cookie-parser';

import initSocketIO from '../socket';
import initRouter from './router';
import { CONSOLE_SUCCESS, initDatabase, initPassport, initSessionStore } from '../utils';
import { env } from 'process';

const startServer = (mongoSession) => {
		const express = expressJS(),
			server = http.createServer(express),
			session = expressSession({
				name: process.env.COOKIE_NAME,
				secret: process.env.COOKIE_SECRET,
				store: initSessionStore(mongoSession),
				resave: false,
				saveUninitialized: false,
				cookie: {
					httpOnly: true,
					secure: true,
					maxAge: 1000 * 3600 * 24 * 15					// 15 Days Session Timeout
				}
			});

		express.enable('trust proxy');
		express.use(cookieParser(process.env.COOKIE_SECRET));
		express.use(session);

		initPassport(express);
		initSocketIO(server, session);

		express.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', req.headers.origin);
			res.header('Access-Control-Allow-Credentials', true);
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

			if (env.SECURE) {
				req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
			}
		});
		initRouter(express);

		server.listen(env.PORT || 8080, () => {
			console.log(true, 'Starting Server');
			console.log(CONSOLE_SUCCESS, 'Server is running at',
				chalk.green('http://' + (env.IP || ip.address() || 'localhost') + ':' + (env.PORT || 8080)));
		});
	},

	initServer = async () => {
		console.log(true, 'Establishing Services');

		const mongoSession = await initDatabase().catch(() => process.exit(1));

		startServer(mongoSession);
	};

export default initServer;
