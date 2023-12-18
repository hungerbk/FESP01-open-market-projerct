interface User {
	_id: number;
	email: string;
	password: string;
	name: string;
	phone: string;
	type: string;
	createdAt: string;
	updatedAt: string;
	extra?: {
		profileImage: string;
		terms: {
			termsOfUse: boolean;
			providingPersonalInformation: boolean;
			recievingMarketingInformation: boolean;
			confirmAge: boolean;
		};
	};
	token: {
		accessToken: string;
		refreshToken: string;
	};
}

interface UserResponse {
	ok: number;
	item: User;
}
