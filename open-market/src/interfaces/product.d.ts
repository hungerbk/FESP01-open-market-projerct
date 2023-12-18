interface Product {
	_id: number;
	seller_id: number;
	price: number;
	shippingFees: number;
	show: boolean;
	active: boolean;
	name: string;
	mainImages: ProductFiles[];
	image?: string;
	content: string;
	quantity: number;
	buyQuantity: number;
	createdAt: string;
	updatedAt: string;
	extra?: {
		isNew: boolean;
		isBest: boolean;
		category: string;
		tags: string[];
		soundFile: ProductFiles;
	};
	replies?: Reply[];
	bookmarks?: Bookmark[];
}

interface ProductListResponse {
	ok: number;
	item: Product[];
}

interface ProductResponse {
	ok: number;
	item: Product;
}

interface ProductFiles {
	path: string;
	name: string;
	originalname: string;
}

// Reply
interface Reply {
	_id: number;
	order_id: number;
	user_id: number;
	product_id: number;
	rating: number;
	content: string;
	createdAt: string;
	userName: string;
	product: Product;
}

interface ReplyResponse {
	ok: number;
	item: Reply;
}

// Bookmark
interface Bookmark {
	_id: number;
	user_id: number;
	product_id: number;
	memo: string;
	createdAt: string;
}

interface BookmarkResponse {
	ok: number;
	item: Bookmark[];
}
