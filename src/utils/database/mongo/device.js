import _ from 'lodash';

import { DEVICE } from '../../../models/';

const getDevicesByID = async (id, columns) => await DEVICE.findById(id, columns).lean(),

	getDeviceData = async (id) => {
		if (_.isArray(id)) {
			return await DEVICE.find({ '_id': { $in: id } }).lean();
		}

		return await getDevicesByID(id);
	};

export { getDevicesByID, getDeviceData };
