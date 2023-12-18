export function numberWithComma(n: number) {
	return String(n).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
