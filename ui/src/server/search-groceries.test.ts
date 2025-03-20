import { mockClient } from "aws-sdk-client-mock";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Uint8ArrayBlobAdapter } from "@smithy/util-stream";

import { searchGroceries, trackGroceryItem } from "./search-groceries";

const lambdaMock = mockClient(LambdaClient);

beforeEach(() => {
  lambdaMock.reset();
});

test("Search groceries returns a list of grocery items", async () => {
  lambdaMock.on(InvokeCommand).resolves({
    Payload: Uint8ArrayBlobAdapter.fromString(JSON.stringify([
      {
        "products": [
          {
            "index": 0,
            "display_name": "Lindt Excellence Dark Chocolate 70% Cocoa Block 100g",
            "price": "5",
            "size": "100G",
            "price_per_unit": "$5.00 per 100g",
            "is_on_special": true,
            "label": "On Special Save $1.50",
            "url": "https://www.woolworths.com.au/shop/productdetails/19731/lindt-excellence-dark-chocolate-70-cocoa-block",
            "code": "19731"
          }
        ]
      }
    ]))
  });

  const result = await searchGroceries({ keyword: "chocolate" });

  expect(result.success).toBeTruthy();
  expect(result.results).toHaveLength(1);
  expect(result.results![0].products).toHaveLength(1);
  expect(result.results![0].products[0].display_name).toBe("Lindt Excellence Dark Chocolate 70% Cocoa Block 100g");
});

test("Search groceries returns empty payload", async () => {
  lambdaMock.on(InvokeCommand).resolves({});

  const result = await searchGroceries({ keyword: "chocolate" });

  expect(result.success).toBeFalsy();
  expect(result.message).not.toBeNull();
});

test("trackGroceryItem timeout error", async () => {
  lambdaMock.on(InvokeCommand).resolves({
    StatusCode: 200,
    Payload: Uint8ArrayBlobAdapter.fromString(JSON.stringify({
      "errorType":"Sandbox.Timedout",
      "errorMessage":"RequestId: 6c14aac6-b810-49ce-9c6c-50104412d524 Error: Task timed out after 3.00 seconds"
    }))
  });

  const result = await searchGroceries({ keyword: "chocolate" });

  expect(result.success).toBeFalsy();
  expect(result.message).not.toBeNull();
});

test("trackGroceryItem successful request", async () => {
  lambdaMock.on(InvokeCommand).resolves({
    StatusCode: 200
  });

  expect(async () => await trackGroceryItem({ code: "1000", "merchant": "wool" })).not.toThrow();
});
