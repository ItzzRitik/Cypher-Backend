import mongoStore from 'connect-mongo';

let sessionStore,
	initSessionStore = (mongoSession) => {
		if (!mongoSession) {
			throw new Error('Provided MongoSession is invalid');
		}

		sessionStore = new mongoStore({ client: mongoSession, stringify: false });
		return sessionStore;
	};

export { sessionStore, initSessionStore };
