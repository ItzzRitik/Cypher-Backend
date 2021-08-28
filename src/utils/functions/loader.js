const loader = (msg) => {
	let x = 0,
		load = ['⠁ ', '⠈ ', ' ⠁', ' ⠈', ' ⠐', ' ⠠', ' ⢀', ' ⡀', '⢀ ', '⡀ ', '⠄ ', '⠂ '];

	return setInterval(() => {
		console.stdout('\r' + load[x = (++x < load.length) ? x : 0] + ' ' + (msg || ''));
	}, 50);
};

export { loader };
