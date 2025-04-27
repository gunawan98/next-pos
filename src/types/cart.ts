interface CartItem {
	id: number;
	product_id: number;
	product_name: string;
	product_image: string;
	quantity: number;
	total_price: number;
	unit_price: number;
}

interface Cart {
	id: string;
	cashier_id: string;
	completed: boolean;
	created_at: Date;
	total_purchase?: number;
	items?: CartItem[];
}

type TypeCurrentCart = {
	id: number;
	completed: boolean;
}

type Item = {
	id: number;
	cart_id: number;
	product_id: number;
	product_name: string;
	quantity: number;
	unit_price: number;
	total_price: number;
};

type Purchase = {
	cart_id: number;
	cashier_id: number;
	total_amount: number;
	paid: number;
	cash_back: number;
	payment_method: string;
	created_at: string;
};

type PaymentData = {
	items: Item[];
	purchase: Purchase;
};

export type { CartItem, Cart, TypeCurrentCart, Item, Purchase, PaymentData };