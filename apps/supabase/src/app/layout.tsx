import "@/app/globals.css";
import type { Viewport } from "next";
import { constructMetadata } from "@/lib/ultis";
import localFont from "next/font/local";

export const metadata = constructMetadata();
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

const inter = localFont({
  src: [
    {
      path: "./InterVariable.woff2",
      style: "normal",
    },
    {
      path: "./InterVariable-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-neutral-100 font-sans`}>
        {children}
        
      </body>
    </html>
  );
}