import "./globals.css";

export const metadata = {
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
      <body>{children}</body>
    </html>
  );
}
