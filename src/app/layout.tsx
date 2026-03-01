import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QoreDev — AI-Native Backend OS",
  description:
    "QoreDev is an AI-native backend operating system with built-in auth, vector database, and autonomous AI copilot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
