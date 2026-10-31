import type { Metadata } from "next";
import { Manrope, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const editorial = Fraunces({
  variable: "--font-editorial",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Terrawave",
    default: "Terrawave | System First, AI Second",
  },
  description: "See the system behind an operational problem. Explore where human judgment, explicit rules and AI belong. Founded by Adarsh Singh Pawar and Rahul Arora.",
  openGraph: {
    type: "website",
    title: "Terrawave | System First, AI Second",
    description: "First, see the system. Then decide what deserves intelligence.",
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
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
