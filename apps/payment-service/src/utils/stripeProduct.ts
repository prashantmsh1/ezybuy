import stripe from "./stripe";
import { StripeProductType } from "@repo/types";

export const createStripProduct = async (item: StripeProductType) => {
	try {
		const res = await stripe.products.create({
			id: item.id,
			name: item.name,
			default_price_data: {
				currency: "usd",
				unit_amount: item.price * 100,
			},
		});
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const getStripeProductById = async (id: string) => {
	try {
		const res = await stripe.products.retrieve(id);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
