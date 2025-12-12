import "./globals.css";

export const metadata = {
  title: "NPCI UPI Switch Monitor",
  description: "Real-time UPI transaction monitoring dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
