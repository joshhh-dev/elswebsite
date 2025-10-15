"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/lg", label: "LG" },
    { href: "/scarpavapor", label: "SCARPAVAPOR" },
    { href: "/prols", label: "ProLS" },
    { href: "/lac", label: "LAC" },
    { href: "/lms", label: "LMS" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between
        px-6 md:px-16 py-5 transition-all duration-500 ease-in-out
        ${
          isScrolled
            ? "bg-gradient-to-b from-black/90 via-black/70 "
            : "bg-gradient-to-b from-black/60 via-black/30 to-transparent"
        }`}
    >
      {/* ===== Logo ===== */}
<Link href="/" className="relative w-[150px] h-[80px] cursor-pointer group">

  {/* Text/logo on top */}
  <Image
    src="/assets/no_logo.png"
    alt="ELS Text"
    width={160}
    height={80}
    className="absolute top-[-35] left-[80px] cursor-pointer transition-transform duration-500 group-hover:scale-110"
  />

  {/* Background circle/logo */}
  <Image
    src="/assets/els_logo_spin.png"
    alt="ELS Circle"
    width={114}
    height={80}
    className="absolute top-2 left-0 cursor-pointer transition-transform duration-500 group-hover:scale-110 group-hover:rotate-360"    style={{ transformOrigin: "center" }}
  />
</Link>





      {/* ===== Desktop Navigation ===== */}
      <nav className="hidden md:flex space-x-10 relative">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <div key={link.href} className="relative pb-2">
              <Link
                href={link.href}
                className={`text-base md:text-lg font-medium tracking-wide transition-colors ${
                  isActive ? "text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>

              {/* Underline animation */}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full shadow-[0_0_8px_rgba(0,200,255,0.5)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* ===== Mobile Menu Button ===== */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* ===== Full-Screen Mobile Menu ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 text-center md:hidden"
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white"
              onClick={() => setMenuOpen(false)}
            >
              <X size={32} />
            </button>

            {/* Navigation Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-2xl font-semibold transition-colors ${
                      isActive
                        ? "text-white underline underline-offset-4"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
