"use client";

import { useActionState } from "react";
import { searchGroceries } from "@/actions/searchGroceries";
import { GrocerySearchActionResponse } from "@/models/grocery";
import SearchResultList from "@/components/SearchResultList";

const initialState: GrocerySearchActionResponse = {
  success: true,
};

export default function SearchGroceryForm() {
  const [state, searchAction, searchPending] = useActionState(searchGroceries, initialState);

  return (
    <>
      <form className="flex flex-col gap-4 items-center" action={searchAction}>
        <label className="flex gap-4 items-center">
          <span>Search for groceries</span>
          <input
            type="text"
            name="keyword"
            placeholder="Enter a keyword"
            className="p-2 border border-gray-300 rounded text-black"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>
      {searchPending && <div>Searching...</div>}
      {!searchPending && !state.success && state.message && <div>{state.message}</div>}
      {!searchPending && !state.success && !state.message && <div>Something went wrong, please try again later.</div>}
      {!searchPending && state.success && state.results && state.results.length > 0 && (
        <SearchResultList products={state.results[0].products} />
      )}
    </>
  );
}
