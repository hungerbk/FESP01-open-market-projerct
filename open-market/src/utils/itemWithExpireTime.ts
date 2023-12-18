export function setItemWithExpireTime(
	key: string,
	value: Product[] | string,
	tts: number,
): void {
	// localStorage에 저장할 객체
	const obj = {
		value,
		expire: Date.now() + tts,
	};

	// 객체를 JSON 문자열로 변환
	const objString = JSON.stringify(obj);

	//setItem
	localStorage.setItem(key, objString);
}

export function getItemWithExpireTime(key: string) {
	// localStorage 값 읽기 (문자열)
	const objString = localStorage.getItem(key);
	if (!objString) return null;

	const obj = JSON.parse(objString);

	// 현재 시간 localStorage의 expire 시간 비교
	if (Date.now() > obj.expire) {
		localStorage.removeItem(key);
		return null;
	}

	// 만료 기간이 남아있는 경우, value 값 리턴
	return obj.value;
}
