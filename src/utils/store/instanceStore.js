let socket;

const isSocketInitialized = !!socket,
	storeSocket = (socketInstance) => {
		socket = socketInstance;
	};

export { socket, isSocketInitialized, storeSocket };
