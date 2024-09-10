import type { Metadata } from "next";
import localFont from "next/font/local";
import {Manrope} from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";



const manrope  = Manrope({subsets: ["latin"]});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Unsigned",
  description: "Let the world hear you",
  icons:{
    icon: '/icons/logo_unsigned.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ConvexClerkProvider>
    <html lang="en">
      <AudioProvider>
      <body
        className={`${manrope.className}`}>
        
        {children}

      </body>
      </AudioProvider>
    </html>
        </ConvexClerkProvider>
  );
}
