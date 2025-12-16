import { Toaster } from "@suzu/ui";
import ModalProvider from "@/components/modals/provider";
import type { Viewport } from "next";
import dynamic from "next/dynamic";
import { constructMetadata } from "@/lib/ultis";
import Script from 'next/script';



export const metadata = constructMetadata();
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

let Toolbar: React.ComponentType = () => null;

if (process.env.NODE_ENV === "development") {
  Toolbar = dynamic(() => import("../toolbar"));
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ${process.env.GA_MEASUREMENT_ID});
        `}
      </Script>
      <ModalProvider>{children}</ModalProvider>
      <Toaster richColors position="bottom-center" />
    </>
  );
}