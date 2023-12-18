interface Order {
	_id: number;
	user_id: number;
	state?: string;
	createdAt: string;
	updatedAt: string;
	products: OrderProduct[];
	cost: {
		products: number;
		shippongFees: 0;
	};
	total: number;
}

interface OrderListResponse {
	ok: number;
	item: Order[];
}

interface OrderResponse {
	ok: number;
	item: Order;
}

interface OrderProduct {
	_id: number;
	quantity: number;
	seller_id: number;
	name: string;
	image: ProductFiles;
	price: number;
	extra: {
		category: string;
		soundFile: ProductFiles;
		tags: string[];
	};
}
