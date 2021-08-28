import _ from 'lodash';

import { USER } from '../../../models/';
import { getDeviceData } from './device';

const getUserByID = async (id, columns) => await USER.findById(id, columns).lean(),

	getDevicesByUserID = async (id) => {
		const userData = await getUserByID(id, 'devices');
		const deviceList = userData?.devices.map(({ id }) => id);
		const deviceDataList = await getDeviceData(deviceList);

		return deviceDataList;
	},
	getBasicUserData = async (id) => {
		const userData = await getUserByID(id, 'firstName lastName email avatars');

		if (userData) {
			userData['avatar'] = userData?.avatars?.find((avatar) => avatar.default).url;
			return _.omit(userData, ['_id', 'avatars']);
		}
	};

export { getUserByID, getBasicUserData, getDevicesByUserID };
