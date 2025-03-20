import "@testing-library/jest-dom";
import Home from "@/app/page";
import { render } from "@testing-library/react";

test("renders home page without crashing", async () => {
  render(await Home());

  const searchForm = document.querySelector("form");
  expect(searchForm).toBeInTheDocument();
});
