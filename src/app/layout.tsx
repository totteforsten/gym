import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Atlas — Modern gym- och rehabapp",
  description:
    "En modern gymapp för att hitta videoguidade övningar, bygga program och följa dina framsteg och rehab.",
};

export const viewport: Viewport = {
  themeColor: "#08090d",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Never let a DB hiccup crash the shell — the login page must still render.
  const user = await getCurrentUser().catch(() => null);
  return (
    <html lang="sv">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Shell userName={user?.name}>{children}</Shell>
      </body>
    </html>
  );
}
