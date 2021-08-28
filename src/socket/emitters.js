import { socket } from '../utils/';

const sessionRefresh = (error, appID, authInfo) => socket.to(appID).emit('sessionRefresh', error, authInfo);

export { sessionRefresh };
