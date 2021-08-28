require('dotenv').config();

let env = process.env,
	AUTH_PROVIDERS = {
		google: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.gender.read'],
		github: ['read:user'],
		facebook: ['email'],
		twitter: []
	},

	GOOGLE_CONFIG = {
		clientID: env.GOOGLE_CLIENT_ID,
		clientSecret: env.GOOGLE_CLIENT_SECRET,
		callbackURL: 'https://localhost/auth/google/callback'
	},
	GITHUB_CONFIG = {
		clientID: env.GITHUB_CLIENT_ID,
		clientSecret: env.GITHUB_CLIENT_SECRET,
		callbackURL: 'https://localhost/auth/github/callback'
	},
	FACEBOOK_CONFIG = {
		clientID: env.FACEBOOK_CLIENT_ID,
		clientSecret: env.FACEBOOK_CLIENT_SECRET,
		callbackURL: 'https://localhost/auth/facebook/callback',
		profileFields: ['id', 'email', 'displayName', 'first_name', 'last_name', 'gender', 'birthday', 'picture.type(large)']
	},
	TWITTER_CONFIG = {
		consumerKey: env.TWITTER_CLIENT_ID,
		consumerSecret: env.TWITTER_CLIENT_SECRET,
		callbackURL: 'https://localhost/auth/twitter/callback',
		includeEmail: true
	};

!GOOGLE_CONFIG.clientID && (GOOGLE_CONFIG = null);
!GITHUB_CONFIG.clientID && (GITHUB_CONFIG = null);
!FACEBOOK_CONFIG.clientID && (FACEBOOK_CONFIG = null);
!TWITTER_CONFIG.consumerKey && (TWITTER_CONFIG = null);

export { GOOGLE_CONFIG, GITHUB_CONFIG, FACEBOOK_CONFIG, TWITTER_CONFIG, AUTH_PROVIDERS };
