import mongoose from 'mongoose';
import { endSession } from '../utils';

const USER = mongoose.model('users', (() => {
		const UserSchema = new mongoose.Schema({
			firstName: { type: String, trim: true },
			lastName: { type: String, trim: true },
			gender: { type: String, trim: true, lowercase: true, enum: ['male', 'female'] },
			dob: { type: Date },
			avatars: [{
				url: String,
				default: { type: Boolean, default: false }
			}],
			email: {
				type: String,
				trim: true, lowercase: true, unique: true, required: true, sparse: true,
				index: { unique: true }
			},
			authApps: [{
				id: { type: String, index: { unique: true } },
				provider: String,
				approved: { type: Boolean, default: false }
			}],
			projects: [{
				id: { type: String, index: { unique: true } },
				name: { type: String, trim: true }
			}]
		},
		{ timestamps: true });

		UserSchema.path('firstName').set((value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
		UserSchema.path('lastName').set((value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());

		return UserSchema;
	})()),

	SESSION = mongoose.model('sessions', (() => {
		return new mongoose.Schema({
			'_id': String,
			'expires': Date,
			'session': Object
		},
		{ '_id': false });
	})()),


	filter = [{
		$match: {
			$and: [{ operationType: 'delete' }]
		}
	}],
	options = { fullDocument: 'updateLookup' };

USER.watch(filter, options).on('change', async ({ documentKey: { _id: user } }) => {
	const sessions = await SESSION.find({ 'session.passport.user': user.toString() });
	await SESSION.deleteMany({ 'session.passport.user': user.toString() });

	sessions.forEach(({ session: { appID } }) => {
		endSession({}, appID);
	});
});

export { USER };
