import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Y-Convo 💬",
  description: "Your Conversation Coach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
