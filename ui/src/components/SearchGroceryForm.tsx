"use client";

import { useActionState } from "react"
import { searchGroceries } from "@/actions/searchGroceries"
import { GrocerySearchResponse } from "@/models/grocery";
import { trackGrocery } from "@/actions/trackGrocery";

const initialState: GrocerySearchResponse[] = []

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
      {!searchPending && state.length > 0 && (
        <ul>
          {state[0].products.map((grocery) => (
            <li key={grocery.index}>
              <a href={grocery.url} target="_blank" rel="noreferrer">
                {grocery.display_name}
              </a>
              <div>A$ {grocery.price}</div>
              <button type="submit" onClick={() => trackGrocery(grocery)}>Save</button>
              </li>
          ))}
        </ul>
      )}
    </>
  )
}
