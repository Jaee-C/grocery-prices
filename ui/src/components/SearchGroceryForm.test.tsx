import "@testing-library/jest-dom";
import "aws-sdk-client-mock-jest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SearchGroceryForm from "@/components/SearchGroceryForm";
import { mockClient } from "aws-sdk-client-mock";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Uint8ArrayBlobAdapter } from "@smithy/util-stream";

const sampleGroceryResponse = [
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
];

const lambdaMock = mockClient(LambdaClient);

beforeEach(() => {
  lambdaMock.reset();
});

describe("SearchGroceryForm", () => {
  it('should render search form', () => {
    render(<SearchGroceryForm />);

    const searchForm = document.querySelector("form");
    expect(searchForm).toBeInTheDocument();
  });

  it('should search groceries when form is submitted', async () => {
    lambdaMock.on(InvokeCommand).resolves({
      StatusCode: 200,
      Payload: Uint8ArrayBlobAdapter.fromString(JSON.stringify(sampleGroceryResponse))
    })

    render(<SearchGroceryForm />)

    searchGrocery();

    await waitFor(() =>
      expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1)
    );
    expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, {
      FunctionName: "search_grocery_prices",
      Payload: JSON.stringify({ keyword: "test" })
    });
    expect(screen.getByText("Searching...")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/Lindt/i)).toBeInTheDocument()
    );
  });

  it('should display error message when request timed out', async () => {
    lambdaMock.on(InvokeCommand).resolves({
      StatusCode: 200,
      Payload: Uint8ArrayBlobAdapter.fromString(JSON.stringify({
        "errorType":"Sandbox.Timedout",
        "errorMessage":"RequestId: 6c14aac6-b810-49ce-9c6c-50104412d524 Error: Task timed out after 3.00 seconds"
      }))
    });

    render(<SearchGroceryForm />);

    searchGrocery();

    await waitFor(() =>
      expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1)
    );

    await waitFor(() =>
      expect(screen.getByText("The search timed out. Please try again.")).toBeInTheDocument()
    );
  });
});

function searchGrocery() {
  const keywordField = screen.getByRole('textbox', { name: 'Search for groceries' });
  const searchButton = screen.getByRole('button', { name: 'Search' });

  fireEvent.change(keywordField, { target: { value: "test" } });
  fireEvent.click(searchButton);
}
