import type { Metadata } from "next";
import "@fontsource-variable/figtree";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/lora";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Mr. Infinity's Sphere",
  description: "Exploring the endless loop of code, design, and ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Satoshi (headings) and Author (reading) from Fontshare, as in the first version */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&f[]=author@400,500,600&display=swap"
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-[#faf5f0] dark:bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_center,_#e3c0a3,_#f4e6d9,_#faf5f0)] dark:bg-[radial-gradient(ellipse_at_center,_#2a1b38,_#110b17,_#0a0a0a)] bg-fixed text-stone-900 dark:text-stone-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
