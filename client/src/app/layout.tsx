import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "PhillyGo",
  description: "A safer way to explore the Philadelphia area.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <head>
        <script src="https://kit.fontawesome.com/c7f29f3608.js" crossOrigin="anonymous" async></script>
      </head>
      <body className="bg-gray-100" style={inter.style}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
