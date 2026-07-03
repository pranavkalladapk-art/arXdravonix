import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import CursorGlow from "@/components/layout/CursorGlow";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arhydraulics.com"),
  title: {
    default: "AR Hydraulics & Sealing Solutions | Precision Engineering",
    template: "%s | AR Hydraulics & Sealing Solutions",
  },
  description:
    "AR Hydraulics and Sealing Solutions — precision hydraulic repair, sealing solutions, fabrication, machining, and industrial roofing engineered for power, reliability, and modern manufacturing.",
  keywords: [
    "hydraulic repair",
    "sealing solutions",
    "hydraulic cylinder repair",
    "hydraulic pumps",
    "hydraulic motors",
    "precision machining",
    "metal fabrication",
    "industrial roofing",
  ],
  openGraph: {
    title: "AR Hydraulics & Sealing Solutions | Precision Engineering",
    description:
      "Precision hydraulic repair, sealing solutions, fabrication, machining, and industrial roofing engineered for power, reliability, and modern manufacturing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text selection:bg-primary">
        <SmoothScrollProvider>
          <CursorGlow />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
