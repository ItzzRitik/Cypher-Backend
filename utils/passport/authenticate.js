import { USER } from '../../models';

const addAuthApp = async (userFromAuth, email, resolve, reject) => {
		const newAuthApp = { provider: userFromAuth.authApps.provider, id: userFromAuth.authApps.id };

		await USER.updateOne({ email },
			{ $push: { authApps: newAuthApp, avatars: userFromAuth.avatars } },
			{ upsert: true }).catch((error) => reject(error));

		return resolve({
			authInfo: { statusCode: 403, authCode: 3, message: 'Authentication method added to existing user. Waiting for admin\'s approval.' }
		});
	},
	authenticate = async (userFromDB, userFromAuth, resolve, reject) => {
		const authApp = userFromDB?.authApps?.find?.(({ provider, id }) =>
			userFromAuth.authApps.provider === provider && userFromAuth.authApps.id === id);

		if (!authApp) {
			return addAuthApp(userFromAuth, userFromDB.email, resolve, reject);
		}
		if (authApp && !authApp.approved) {
			return resolve({
				authInfo: { statusCode: 403, authCode: 0,
					message: `Your account is currently in review for ${userFromAuth.authApps.provider} authentication!` }
			});
		}

		return resolve({
			user: userFromDB,
			authInfo: { statusCode: 200, authCode: 1, message: 'Authentication successful.' }
		});
	},
	createAccount = async (user, resolve, reject) => {
		await USER.create(user).catch((error) => reject(error));

		return resolve({
			authInfo: { statusCode: 200, authCode: 2, message: 'New account created and submitted for review.' }
		});
	},

	initAuth = (userFromAuth) => {
		return new Promise(async (resolve, reject) => {
			const userFromDB = await USER.findOne({ email: userFromAuth.email }).catch((error) => reject(error));

			if (!userFromDB) {
				userFromAuth['avatars'][0]['default'] = true;
				return createAccount(userFromAuth, resolve, reject);
			}

			userFromAuth.authApps = userFromAuth.authApps[0];
			userFromAuth.avatars = userFromAuth.avatars[0];
			return authenticate(userFromDB, userFromAuth, resolve, reject);
		});
	};

export default initAuth;
