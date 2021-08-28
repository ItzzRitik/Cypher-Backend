import { socket } from '../store/instanceStore';

const getSocketBySocketID = (socketID) => {
		return socket?.sockets?.connected?.[socketID];
	},
	getAppIDBySocketID = (socketID) => {
		return getSocketBySocketID(socketID)?.handshake?.query?.app?.id;
	};

export { getSocketBySocketID, getAppIDBySocketID };
