"use client";

import { useColorScheme, useMediaQuery } from "@mui/material";
import { useEffect } from "react";

/*
  * This component sets the color scheme based on the user's preference.
  * This is necessary because automatic color scheme detection is
  * not supported in some browsers (e.g. Firefox).
 */
export default function ColorScheme() {
  const { setMode } = useColorScheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (prefersDarkMode) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, [prefersDarkMode, setMode]);
  return null;
}
