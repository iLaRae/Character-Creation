import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Magic Sketch Studio — Bring your sketches to life",
  description:
    "Upload or snap a photo of any pencil sketch and let AI colorize it in 16+ art styles — watercolor, comic, marker, cel-shaded and more. Free, fast, and runs in your browser.",
  keywords: [
    "sketch colorizer",
    "AI coloring",
    "line art to color",
    "watercolor",
    "comic style",
    "art tool",
  ],
  metadataBase: new URL("https://magic-sketch-studio.app"),
  openGraph: {
    title: "Magic Sketch Studio",
    description:
      "Turn your line-art sketches into fully colored artwork with AI — 16+ styles, instant results.",
    type: "website",
  },
  themeColor: "#06081a",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06081a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
