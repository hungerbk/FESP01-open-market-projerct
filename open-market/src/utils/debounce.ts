export function debounce(callback: Function, timeout = 300) {
	let cleanup: ReturnType<typeof setTimeout>;
	return (...args: any[]) => {
		clearTimeout(cleanup);
		cleanup = setTimeout(callback.bind(null, ...args), timeout);
	};
}
