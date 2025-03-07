'use server';

import { GrocerySearchQuery, GrocerySearchResponse } from "@/models/grocery";
import { searchGroceries as search } from "@/server/search-groceries";

export async function searchGroceries(prevState: GrocerySearchResponse[],formData: FormData) {

  const searchQuery: GrocerySearchQuery = {
    keyword: formData.get("keyword") as string
  };

  const results = await search(searchQuery);

  return results;
}
