import "@testing-library/jest-dom";

import ColorScheme from "@/components/ColorScheme";
import { render } from "@testing-library/react";
import { useColorScheme, useMediaQuery } from "@mui/material";

const setMode = jest.fn();

jest.mock("@mui/material", () => ({
  useMediaQuery: jest.fn(),
  useColorScheme: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("should set light mode", () => {
  const prefersDarkMode = false;
  (useMediaQuery as jest.Mock).mockReturnValue(prefersDarkMode);
  (useColorScheme as jest.Mock).mockReturnValue({ setMode });

  render(<ColorScheme />);

  expect(setMode).toHaveBeenCalledWith("light");
});

test("should set dark mode", () => {
  const prefersDarkMode = true;
  (useMediaQuery as jest.Mock).mockReturnValue(prefersDarkMode);
  (useColorScheme as jest.Mock).mockReturnValue({ setMode });

  render(<ColorScheme />);

  expect(setMode).toHaveBeenCalledWith("dark");
});
