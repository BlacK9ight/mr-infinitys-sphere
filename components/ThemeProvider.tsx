"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Light by default, as in the first version of the site. A visitor's choice is remembered.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
