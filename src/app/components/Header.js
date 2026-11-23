"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";

const NAV_LINKS = [
  { href: "/rbpn", label: "Find a Dealer" },
  { href: "/announcements", label: "Announcements" },
  { href: "/quick-links/about", label: "About" },
  { href: "/quick-links/contact", label: "Contact" },
];

export default function Header({ products = [] }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isProductActive = products.some((p) => `/${p.slug}` === pathname);

  // Groups products under the fixed "Solutions" categories (see
  // productCategories.js) in a fixed display order, skipping any category
  // with nothing published under it yet (e.g. Cleaning Solutions/System
  // Solutions before their Figma-redesign phases ship real products) — an
  // uncategorized product (category not yet set by the admin) simply
  // doesn't appear in this menu.
  const solutionsGroups = useMemo(
    () =>
      PRODUCT_CATEGORIES.map((category) => ({
        category,
        items: products.filter((p) => p.category === category),
      })).filter((group) => group.items.length > 0),
    [products]
  );

  const openProducts = () => {
    clearTimeout(closeTimer.current);
    setProductsOpen(true);
  };
  const scheduleCloseProducts = () => {
    closeTimer.current = setTimeout(() => setProductsOpen(false), 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-gradient-to-b from-black/90 via-black/70 to-black/40"
          : "bg-gradient-to-b from-black/60 via-black/30 to-transparent"
      }`}
    >
      <div className="flex items-center px-6 md:px-10 py-4 md:py-6">
        {/* ===== Logo (left) ===== */}
        <Link href="/" className="flex items-center -space-x-2 shrink-0 group">
          <Image
            src="/assets/els_logo_spin.png"
            alt="ELS Circle"
            width={125}
            height={80}
            className="h-14 w-14 md:h-16 md:w-16 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-360"
            style={{ transformOrigin: "center" }}
          />
          <Image
            src="/assets/no_logo.png"
            alt="ELS Philippines Inc."
            width={160}
            height={80}
            // no_logo.png is a white wordmark — legible over the dark hero
            // images this transparent header floats above; may need a dark
            // variant later for pages whose top is light-colored.
            className="h-10 md:h-12 w-auto cursor-pointer transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* ===== Desktop nav (right side) ===== */}
        <nav className="hidden md:flex items-center gap-8 ml-auto">
          <Link
            href="/rbpn"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/rbpn" ? "text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Find a Dealer
          </Link>

          {/* ===== Solutions mega-menu ===== */}
          {/* Nothing to show (no product categorized yet) — omit the
              trigger entirely rather than render a button whose
              aria-expanded/chevron can flip open with no panel beneath it. */}
          {solutionsGroups.length > 0 && (
          <div
            className="relative"
            onMouseEnter={openProducts}
            onMouseLeave={scheduleCloseProducts}
          >
            <button
              onClick={() => setProductsOpen((v) => !v)}
              className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors ${
                isProductActive ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              aria-expanded={productsOpen}
            >
              Solutions
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-3 w-[32rem] max-w-[90vw] rounded-xl bg-brand-navy border border-white/10 shadow-xl overflow-hidden p-5 grid grid-cols-2 gap-x-6 gap-y-5"
                >
                  {solutionsGroups.map(({ category, items }) =>
                    items.length === 1 ? (
                      <Link
                        key={category}
                        href={`/${items[0].slug}`}
                        className={`block text-sm font-semibold transition-colors ${
                          pathname === `/${items[0].slug}` ? "text-white" : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {category}
                      </Link>
                    ) : (
                      <div key={category}>
                        <span className="block text-sm font-semibold text-white mb-2">{category}</span>
                        <div className="flex flex-col gap-1.5">
                          {items.map((product) => (
                            <Link
                              key={product.id}
                              href={`/${product.slug}`}
                              className={`text-sm transition-colors ${
                                pathname === `/${product.slug}`
                                  ? "text-white"
                                  : "text-gray-300 hover:text-white"
                              }`}
                            >
                              {product.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          )}

          <Link
            href="/announcements"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/announcements" ? "text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Announcements
          </Link>

          <Link
            href="/quick-links/about"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/quick-links/about" ? "text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            About
          </Link>

          <Link
            href="/quick-links/contact"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/quick-links/contact" ? "text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* ===== Mobile Menu Button ===== */}
        <button
          className="md:hidden ml-auto text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ===== Mobile Menu (slide-down panel) ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-brand-navy border-t border-white/10"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV_LINKS.slice(0, 1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 text-base font-medium border-b border-white/10 ${
                    pathname === link.href ? "text-white" : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Solutions (expandable) */}
              {solutionsGroups.length > 0 && (
                <>
                  <button
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    className={`flex items-center justify-between py-3 text-base font-medium border-b border-white/10 ${
                      isProductActive ? "text-white" : "text-gray-300"
                    }`}
                  >
                    Solutions
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${mobileProductsOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileProductsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col overflow-hidden bg-white/5 rounded-lg my-2 px-4 py-2"
                      >
                        {solutionsGroups.map(({ category, items }) => (
                          <div key={category} className="py-2">
                            {items.length === 1 ? (
                              <Link
                                href={`/${items[0].slug}`}
                                onClick={() => setMenuOpen(false)}
                                className={`text-sm font-semibold block ${
                                  pathname === `/${items[0].slug}` ? "text-white" : "text-gray-200"
                                }`}
                              >
                                {category}
                              </Link>
                            ) : (
                              <>
                                <span className="text-sm font-semibold text-gray-200 block mb-1.5">
                                  {category}
                                </span>
                                <div className="flex flex-col gap-1.5 pl-3">
                                  {items.map((product) => (
                                    <Link
                                      key={product.id}
                                      href={`/${product.slug}`}
                                      onClick={() => setMenuOpen(false)}
                                      className={`text-sm block ${
                                        pathname === `/${product.slug}` ? "text-white" : "text-gray-300"
                                      }`}
                                    >
                                      {product.name}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {NAV_LINKS.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 text-base font-medium border-b border-white/10 last:border-b-0 ${
                    pathname === link.href ? "text-white" : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
