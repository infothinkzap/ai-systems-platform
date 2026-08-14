import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Terrawave",
    default: "Terrawave | Problem-First AI Systems",
  },
  description: "Terrawave builds deterministic and probabilistic intelligence systems to solve operational friction. Founded by Adarsh Singh Pawar and Rahul Arora.",
  openGraph: {
    type: "website",
    title: "Terrawave | AI Systems & Intelligence",
    description: "Terrawave builds rigorous AI systems grounded in deterministic architecture.",
    siteName: "Terrawave",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terrawave",
    description: "Problem-first AI systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
