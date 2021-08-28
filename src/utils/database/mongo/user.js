import _ from 'lodash';

import { USER } from '../../../models/';

const getUserByID = async (id, columns) => await USER.findById(id, columns).lean(),

	getBasicUserData = async (id) => {
		const userData = await getUserByID(id, 'firstName lastName email avatars');

		if (userData) {
			userData['avatar'] = userData?.avatars?.find((avatar) => avatar.default).url;
			return _.omit(userData, ['_id', 'avatars']);
		}
	};

export { getUserByID, getBasicUserData };
