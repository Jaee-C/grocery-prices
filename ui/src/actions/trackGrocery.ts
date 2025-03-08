'use server';

import { Grocery, TrackGroceryQuery } from "@/models/grocery";
import { trackGroceryItem } from "@/server/search-groceries";

export async function trackGrocery(product: Grocery) {
  const request: TrackGroceryQuery = {
    code: product.code,
    merchant: "woolworths"
  };

  await trackGroceryItem(request);
}
