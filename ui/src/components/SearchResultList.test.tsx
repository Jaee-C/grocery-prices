import "@testing-library/jest-dom";
import "aws-sdk-client-mock-jest";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockClient } from "aws-sdk-client-mock";
import SearchResultList from "@/components/SearchResultList";

const sampleProductList =  [
    {
      "index": "0",
      "display_name": "Lindt Excellence Dark Chocolate 70% Cocoa Block 100g",
      "price": 5,
      "size": "100G",
      "price_per_unit": "$5.00 per 100g",
      "is_on_special": true,
      "label": "On Special Save $1.50",
      "url": "https://www.woolworths.com.au/shop/productdetails/19731/lindt-excellence-dark-chocolate-70-cocoa-block",
      "code": "19731"
    }
];

const lambdaMock = mockClient(LambdaClient);

beforeEach(() => {
  lambdaMock.reset();
});

describe("SearchResultList", () => {
  it('should save selected grocery when clicking the Save button', async () => {
    lambdaMock.on(InvokeCommand, { FunctionName: "add_grocery_item" }).resolves({
      StatusCode: 200
    });

    render(<SearchResultList products={sampleProductList} />)

    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, {
        FunctionName: "add_grocery_item",
        Payload: JSON.stringify({ code: "19731", merchant: "woolworths" })
      })
    );
  });
})
