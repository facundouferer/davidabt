import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import CatalogDownload from "./components/CatalogDownload";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "David Abt",
  description: "Portfolio of David Abt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header with Signature */}
        <Header />
        <div className="flex flex-col bg-background text-foreground">
          {children}
        </div>
        <footer className="w-full py-8 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 bg-background text-foreground mt-auto">
          <span>
            &copy; {new Date().getFullYear()} David Abt
          </span>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/eventos" className="hover:[text-shadow:0_0_10px_#ffffff] transition-all duration-300 text-lg">
              Eventos
            </Link>
            <Link href="/curriculum" className="hover:[text-shadow:0_0_10px_#ffffff] transition-all duration-300 text-lg">
              Curriculum
            </Link>
            <CatalogDownload />
          </div>

          <div className="flex items-center gap-8 mt-4 md:mt-0">
            <a
              href="https://www.instagram.com/david.abt1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="Instagram"
            >
              <FaInstagram size={28} />
            </a>
            <a
              href="https://wa.me/5493624567700"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={28} />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
