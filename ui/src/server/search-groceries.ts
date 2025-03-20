import { InvokeCommand } from "@aws-sdk/client-lambda";

import {
  GrocerySearchQuery,
  TrackGroceryQuery,
  GrocerySearchApiResponse,
  GrocerySearchActionResponse
} from "@/models/grocery";
import { client } from "./client";

export async function searchGroceries(query: GrocerySearchQuery): Promise<GrocerySearchActionResponse> {
  const command = new InvokeCommand({
    FunctionName: "search_grocery_prices",
    Payload: JSON.stringify(query)
  });

  const response = await client.send(command);

  console.log(`Search groceries query returned with code ${response.StatusCode}`);

  if (response.Payload) {
    const responseString = Buffer.from(response.Payload).toString("utf8");

    if (isLambdaTimeoutError(responseString)) {
      return {
        success: false,
        message: "The search timed out. Please try again."
      };
    }
    return {
      success: true,
      results: JSON.parse(responseString) as GrocerySearchApiResponse[]
    };
  } else {
    return {
      success: false,
      message: "No payload returned from search groceries query"
    };
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
