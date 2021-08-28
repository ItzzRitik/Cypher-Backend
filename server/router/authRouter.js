import _ from 'lodash';
import passport from 'passport';
import { Router } from 'express';

import { AUTH_PROVIDERS, authCallback, endSession } from '../../utils/';

const router = Router(),
	addSocketIDtoSession = (req, res, next) => {
		req.session.appID = req.query.appID;
		next();
	},
	passportAuth = (authApp) => passport.authenticate(authApp, _.pickBy({ scope: AUTH_PROVIDERS[authApp] })),
	passportCallback = (authProvider, req, res, next) => {
		passport.authenticate(authProvider, (error, user, authInfo) => {
			if (error) return next(error);
			if (!user) return res.redirect('/auth/sessionCallback?authInfo=' + Buffer.from(JSON.stringify(authInfo)).toString('base64'));

			req.logIn(user, (err) => {
				if (err) return next(err);
				return res.redirect('/auth/sessionCallback?authInfo=' + Buffer.from(JSON.stringify(authInfo)).toString('base64'));
			});
		})(req, res, next);
	},

	authRouter = () => {
		router.get('/sessionCallback', authCallback);
		router.get('/logout', endSession);

		Object.keys(AUTH_PROVIDERS).forEach((authProvider) => {
			router.get(`/${authProvider}`, addSocketIDtoSession, passportAuth(authProvider));
			router.get(`/${authProvider}/callback`, (...args) => passportCallback(authProvider, ...args));
		});

		return router;
	};

export default authRouter;
