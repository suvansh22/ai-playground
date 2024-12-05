import { StreamContext } from "@/context/StreamContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Playground",
  description: "AI Playground by Open Ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StreamContext>{children}</StreamContext>
      </body>
    </html>
  );
}
