import authRouter from './authRouter';

const initRouter = (express) => {
	express.use('/auth', authRouter());

	express.get('/', (req, res) => {
		res.send('Welcome to Cypher');
	});
};

export default initRouter;
