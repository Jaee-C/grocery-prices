'use server';

import { GrocerySearchQuery, GrocerySearchActionResponse } from "@/models/grocery";
import { searchGroceries as search } from "@/server/search-groceries";

export async function searchGroceries(prevState: GrocerySearchActionResponse, formData: FormData) {

  const searchQuery: GrocerySearchQuery = {
    keyword: formData.get("keyword") as string
  };

  const results = await search(searchQuery);

  return results;
}
