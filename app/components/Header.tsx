"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full relative flex justify-center items-center py-3 z-50">
      {/* Logo */}
      <Link href="/" className="relative w-64 h-24 block z-50">
        <Image
          src="/images/firma.png"
          alt="David Abt Signature"
          fill
          className="object-contain"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex absolute right-8 gap-6">
        <Link
          href="/"
          className="hover:[text-shadow:0_0_10px_#ffffff] transition-all duration-300 text-lg"
        >
          Inicio
        </Link>
        <Link
          href="/eventos"
          className="hover:[text-shadow:0_0_10px_#ffffff] transition-all duration-300 text-lg"
        >
          Eventos
        </Link>
        <Link
          href="/curriculum"
          className="hover:[text-shadow:0_0_10px_#ffffff] transition-all duration-300 text-lg"
        >
          Curriculum
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden absolute right-8 z-50 text-foreground"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
      </button>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 bg-black/90 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
      >
        <Link
          href="/"
          className="text-2xl hover:[text-shadow:0_0_10px_#ffffff] transition-all duration-300"
          onClick={toggleMenu}
        >
          Inicio
        </Link>
        <Link
          href="/eventos"
          className="text-2xl hover:[text-shadow:0_0_10px_#ffffff] transition-all duration-300"
          onClick={toggleMenu}
        >
          Eventos
        </Link>
        <Link
          href="/curriculum"
          className="text-2xl hover:[text-shadow:0_0_10px_#ffffff] transition-all duration-300"
          onClick={toggleMenu}
        >
          Curriculum
        </Link>
      </div>
    </header>
  );
}
