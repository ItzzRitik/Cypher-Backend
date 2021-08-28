import _ from 'lodash';
import passport from 'passport';

import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GithubStrategy } from 'passport-github2';

import initAuth from './authenticate';
import { USER } from '../../models';
import { GOOGLE_CONFIG, GITHUB_CONFIG, FACEBOOK_CONFIG, TWITTER_CONFIG } from '../config/authConfig';

const getAvatars = (pictures, provider) => {
		return pictures?.map(({ value }) => {
			if (provider === 'google') return { url: value.substring(0, value.indexOf('=s')) };
			if (provider === 'github') return { url: value.substring(0, value.indexOf('?v=')) };
			if (provider === 'twitter') return { url: value.replace('_normal', '') };
			return { url: value };
		});
	},
	passportCallback = (accessToken, refreshToken, profile, done) => {
		let user = profile._json,
			name = (profile.displayName || profile.name).split(' ');

		user = {
			firstName: name.shift(),
			lastName: name.join(' '),
			email: user.email,
			gender: user.gender,
			dob: user.birthday && new Date(user.birthday + 'Z'),
			authApps: [{ provider: profile.provider, id: (user.sub || user.id).toString() }],
			avatars: getAvatars(profile.photos, profile.provider)
		};

		return initAuth(_.pickBy(user))
			.then(({ user, authInfo }) => {
				return done(null, user ?? false, authInfo);
			})
			.catch((error) => {
				console.log(error);
				return done(null, false, error);
			});
	},

	initPassport = (express) => {
		express.use(passport.initialize());
		express.use(passport.session());

		GOOGLE_CONFIG && passport.use(new GoogleStrategy(GOOGLE_CONFIG, passportCallback));
		GITHUB_CONFIG && passport.use(new GithubStrategy(GITHUB_CONFIG, passportCallback));
		FACEBOOK_CONFIG && passport.use(new FacebookStrategy(FACEBOOK_CONFIG, passportCallback));
		TWITTER_CONFIG && passport.use(new TwitterStrategy(TWITTER_CONFIG, passportCallback));

		passport.serializeUser((user, done) => done(null, user.id));
		passport.deserializeUser((id, done) => USER.findById(id, (err, user) => done(err, user)));
	};

export { initPassport };
