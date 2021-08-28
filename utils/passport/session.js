import { sessionRefresh } from '../../socket/emitters';

const isAuthenticated = (req) => {
		return !!req.sessionID && !!req?.session?.passport?.user;
	},
	authCallback = (req) => {
		const authInfo = JSON.parse(Buffer.from(req.query.authInfo, 'base64').toString('ascii'));
		sessionRefresh(null, req.session.appID, authInfo);
	},
	endSession = ({ session }, appID) => {
		const authInfo = { statusCode: 200, authCode: -1, message: 'Session successfully ended' };

		if (session?.passport?.user) {
			return session.destroy((error) => sessionRefresh(error, session.appID, authInfo));
		}

		return sessionRefresh(null, appID, authInfo);
	};

export { authCallback, endSession, isAuthenticated };
