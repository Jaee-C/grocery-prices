import { InvokeCommand } from "@aws-sdk/client-lambda";

import { GrocerySearchQuery, TrackGroceryQuery, GrocerySearchResponse } from "@/models/grocery";
import { client } from "./client";

export async function searchGroceries(query: GrocerySearchQuery): Promise<GrocerySearchResponse[]> {
  const command = new InvokeCommand({
    FunctionName: "search_grocery_prices",
    Payload: JSON.stringify(query)
  });

  const response = await client.send(command);

  console.log(`Search groceries query returned with code ${response.StatusCode}`);

  if (response.Payload) {
    return JSON.parse(new TextDecoder().decode(response.Payload)) as GrocerySearchResponse[];
  } else {
    throw new Error("No payload returned from search groceries query");
  }
}

export async function trackGroceryItem(query: TrackGroceryQuery): Promise<void> {
  const command = new InvokeCommand({
    FunctionName: "add_grocery_item",
    Payload: JSON.stringify(query)
  });

  const response = await client.send(command);

  console.log(`Track grocery item query returned with code ${response.StatusCode}`);
}
