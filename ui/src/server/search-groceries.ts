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
    const responseString = Buffer.from(response.Payload).toString('utf8');

    if (isLambdaTimeoutError(responseString)) {
      throw new Error("Request timed out, please try again.");
    }

    return JSON.parse(responseString) as GrocerySearchResponse[];
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

function isLambdaTimeoutError(lambdaResponse: string): boolean {
  const response = JSON.parse(lambdaResponse);

  return response.errorType === "Sandbox.Timedout";
}
