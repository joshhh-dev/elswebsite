"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import DealerAvatar from "../../components/DealerAvatar";
import { rbpnDealers } from "@/lib/rbpnDealers";

// Real "Philippine RBP Territory Coverage" map (see rbpn-territory-map.jpg),
// transcribed per-dealer into rbpnDealers.js's `territories` field. The map
// image is dense at mobile width, so this text list is the accessible/mobile
// fallback, not just a caption.

export default function FindADealerPage() {
  const dealers = rbpnDealers.map((dealer) => ({
    name: dealer.company,
    location: dealer.area,
    slug: dealer.slug,
  }));

    const [showTypewriter, setShowTypewriter] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    // Start typewriter 1.3s after main title appears
    const timer = setTimeout(() => {
      setShowTypewriter(true);
    }, 2500); // adjust based on your main title delay/duration

    return () => clearTimeout(timer);
  }, []);



  // Show popup when user reaches end of page
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setShowPopup(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <main className="min-h-screen flex flex-col">


{/* Header Section */}
<section className="relative flex flex-col items-center justify-start px-4 text-center min-h-[80vh] md:min-h-[90vh] overflow-hidden pt-20 md:pt-32">

  {/* Background Image with smooth transition */}
  <motion.div
    initial={{ scale: 1.2, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 2.5, ease: "easeOut" }}
    className="absolute inset-0 -z-20"
  >
    <Image
      src="/assets/rbpn.webp"
      alt="RBPN Background"
      fill
      priority
      quality={100}
      className="object-cover object-center"
      sizes="100vw"
    />
  </motion.div>

  {/* Gradient Overlay for readability */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.45 }}
    transition={{ duration: 2 }}
    className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent -z-10"
  />

  {/* Text container */}
  <div className="relative z-10">
    {/* Main Title */}
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.8 }}
      className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white drop-shadow-2xl px-4 leading-tight"
    >
      Find A Dealer Near You
    </motion.h1>

    {/* Subtitle / Typewriter */}
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.8 }}
      className="text-2xl sm:text-3xl md:text-4xl text-gray-200 mt-4 drop-shadow-xl font-medium min-h-[50px]"
      >
      {showTypewriter && (
        <span className="fade-in-typewriter animate-typing">
          Choose From Our Trusted Dealer Network
        </span>
      )}
    </motion.p>
  </div>
</section>



      {/* Territory Coverage */}
      <section className="flex flex-col items-center py-12 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-6xl w-full">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-3">
            Philippine RBP Territory Coverage
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-4">
            Each Regional Business Partner has a Preferred Territory — their
            home base, where they&apos;re the active local partner. Nearby
            provinces shown as open are not yet formally served by any
            partner; ELS may assign coverage there as the network grows —{" "}
            <Link href="/rbpn-dealer" className="text-blue-600 underline">
              apply to become one
            </Link>
            .
          </p>

          <div className="flex items-center justify-center gap-5 text-xs text-gray-500 mb-10">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              Preferred Territory
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
              Open for RBPN Assignment
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
              <Image
                src="/assets/rbpn-territory-map.jpg"
                alt="Philippine RBP Territory Coverage map"
                width={680}
                height={1290}
                className="w-full h-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {rbpnDealers.map((dealer) => (
                <div
                  key={dealer.slug}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <Link
                    href={`/rbpn/${dealer.slug}`}
                    className="font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {dealer.aka}
                  </Link>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {dealer.territories.map((territory, i) => (
                      <li key={territory} className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                            i === 0 ? "bg-amber-400" : "bg-green-400"
                          }`}
                        />
                        {territory}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dealer Cards */}
      <section className="flex flex-col items-center py-12 px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl w-full">
          {dealers.map((dealer, index) => (
            <motion.div
              key={dealer.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true }}
              className="bg-white shadow-md sm:shadow-lg rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all hover:-translate-y-1 sm:hover:-translate-y-2"
            >
              <Link href={`/rbpn/${dealer.slug}`} className="no-underline">
                <div className="flex flex-col items-center">
                  <DealerAvatar
                    name={dealer.name}
                    size={100}
                    className="mb-4 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]"
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
                    {dealer.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 text-center">
                    {dealer.location}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    <AnimatePresence>
      {showPopup && !minimized && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div className="relative bg-white shadow-2xl p-8 rounded-2xl border border-gray-200 max-w-md w-[90%] text-center">
            {/* Minimize Button */}
            <button
              onClick={() => setMinimized(true)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ▬
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Become an RBPN Dealer
            </h2>

            <p className="text-gray-600 mb-6 text-lg">
              Join our trusted RBPN dealer network and grow your business with us!
            </p>

            <Link href="../rbpn-dealer">
              <button className="bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold px-6 py-3 rounded-xl w-full shadow-lg hover:shadow-2xl transition-all duration-300">
                Apply Now
              </button>
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* Minimized Bar */}
      {showPopup && minimized && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-full px-6 py-3 cursor-pointer flex items-center justify-between z-50 max-w-sm w-[90%]"
          onClick={() => setMinimized(false)}
        >
          <span className="text-gray-800 font-medium">
            Become an RBPN Dealer
          </span>
          <span className="ml-4 text-gray-500">▲</span>
        </motion.div>
      )}
    </AnimatePresence>
    </main>
  );
}
