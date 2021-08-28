import initServer from './server';
import { initLogger } from './utils';

const initCypher = () => {
	initLogger();
	initServer();
};

initCypher();
