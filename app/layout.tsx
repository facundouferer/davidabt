import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import CatalogDownload from "./components/CatalogDownload";
import ClientLoader from "./components/ClientLoader";

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
    default: "David Abt - Escultor y Artista Plástico Chaqueño",
    template: "%s | David Abt"
  },
  description: "David Abt es un escultor y artista plástico chaqueño cuya obra se caracteriza por una exploración profunda del volumen, la fantasía y lo simbólico, con un fuerte anclaje en el territorio del Gran Chaco.",
  keywords: ["David Abt", "escultor", "artista plástico", "Chaco", "escultura", "arte", "Gran Chaco", "arte argentino", "volumen", "fantasía", "simbólico"],
  authors: [{ name: "David Abt" }],
  creator: "David Abt",
  publisher: "David Abt",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://davidabt.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'David Abt',
    title: 'David Abt - Escultor y Artista Plástico Chaqueño',
    description: 'David Abt es un escultor y artista plástico chaqueño cuya obra se caracteriza por una exploración profunda del volumen, la fantasía y lo simbólico, con un fuerte anclaje en el territorio del Gran Chaco.',
    images: [
      {
        url: '/images/fotodavidabt.png',
        width: 1200,
        height: 630,
        alt: 'David Abt - Escultor y Artista Plástico',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Abt - Escultor y Artista Plástico Chaqueño',
    description: 'David Abt es un escultor y artista plástico chaqueño cuya obra se caracteriza por una exploración profunda del volumen, la fantasía y lo simbólico, con un fuerte anclaje en el territorio del Gran Chaco.',
    images: ['/images/fotodavidabt.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "David Abt",
    "jobTitle": "Escultor y Artista Plástico",
    "description": "David Abt es un escultor y artista plástico chaqueño cuya obra se caracteriza por una exploración profunda del volumen, la fantasía y lo simbólico, con un fuerte anclaje en el territorio del Gran Chaco.",
    "image": "/images/fotodavidabt.png",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://davidabt.com",
    "sameAs": [
      "https://www.instagram.com/david.abt1"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Chaco",
      "addressCountry": "AR"
    }
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLoader>
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
        </ClientLoader>
      </body>
    </html>
  );
}

