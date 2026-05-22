import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "KurdFlight",
  description: "Premium airline booking experience across Kurdistan and beyond.",
};

const themeScript = `
(() => {
  try {
    const theme = window.localStorage.getItem("kurdflight-theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
