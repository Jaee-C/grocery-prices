import { mockClient } from "aws-sdk-client-mock";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Uint8ArrayBlobAdapter } from "@smithy/util-stream";

import { searchGroceries } from "./search-groceries";

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
  })

  const result = await searchGroceries({ keyword: "chocolate" });

  expect(result).toHaveLength(1);
  expect(result[0].products).toHaveLength(1);
  expect(result[0].products[0].display_name).toBe("Lindt Excellence Dark Chocolate 70% Cocoa Block 100g");
});

test("Search groceries returns empty payload", async () => {
  lambdaMock.on(InvokeCommand).resolves({})

  const search = async () => await searchGroceries({ keyword: "chocolate" });

  await expect(search).rejects.toThrow(Error);
})
