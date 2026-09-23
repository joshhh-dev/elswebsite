"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "./components/Button";
import LocationTabs from "./components/LocationTabs";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const solutions = [
    {
      id: 1,
      title: "Personal & Commercial Laundry",
      tag: "LG",
      href: "/lg",
      image: "/assets/lg.webp",
      colSpan: "md:row-span-2",
      height: "h-100", // 👈 individual height
      fit: "object-cover", // 👈 individual fit
    },
    {
      id: 2,
      title: "Scarpavapor No Limits",
      tag: "Scarpavapor",
      href: "/scarpavapor",
      image: "/assets/scarpa.webp",
      height: "h-80",
      fit: "object-contain",
    },
    {
      id: 3,
      title: "Laundry Business Management",
      tag: "LMS",
      href: "/lms",
      image: "/assets/lms_2.webp",
      height: "h-80",
      fit: "object-contain",
    },
    {
      id: 4,
      title: "lagoon® Advanced Care",
      tag: "LAC",
      href: "/lac",
      image: "/assets/lac.webp",
      height: "h-72",
      fit: "object-contain",
    },
    {
      id: 5,
      title: "Professional Laundry Solutions",
      tag: "ProLS",
      href: "/prols",
      image: "/assets/prols.webp",
      height: "h-90",
      fit: "object-contain",
    },
  ];
  const stats = [
    {
      id: 1,
      number: "25,000+",
      text: "Business and facility installations and projects around the Philippines.",
    },
    {
      id: 2,
      number: "120,000+",
      text: "Supplied equipment for hotels, resorts, hospitals, laundry shops, and many more.",
    },
    {
      id: 3,
      number: "10,000+",
      text: "Operations and cleaning trainings and seminars for all kinds of laundry segments.",
    },
    {
      id: 4,
      number: "60+",
      text: "In-house experts for laundry consultations, after-sales, R&D, and many more.",
    },
    {
      id: 5,
      number: "1,500m²",
      text: "Laundry equipment, materials, and after-sales spare parts warehouse.",
    },
  ]

  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-12 min-h-[130vh]">
        {/* Background Image */}
      <motion.div
        className="absolute inset-0 -z-10 w-full h-full"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/assets/hm_bg2.png"
          alt="Laundry background"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center brightness-80 rounded-lg"
        />
      </motion.div>

      {/* Gradient overlay — darker at top (behind the header/nav) and bottom
          (behind the CTA buttons/section transition), lighter in the middle
          so the photo still shows through, keeping white text readable
          throughout the hero regardless of scroll position. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/65 rounded-lg" />


        {/* Animated text */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight drop-shadow-lg max-w-7xl"
        >
          Start your laundry business
          <br className="hidden md:block" /> like a veteran.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl md:text-3xl font-medium text-gray-200 mb-6"
        >
          Low stress, high profit.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg text-gray-300 mb-8"
        >
          ⭐ Google Reviews:{" "}
          <span className="font-semibold text-white">4.8/5</span> (200+ reviews)
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 w-full max-w-2xl"
        >
          <Button href="/quick-links/about" variant="secondary" size="lg" className="flex-1">
            About Us
          </Button>
          <Button href="/rbpn" variant="secondary" size="lg" className="flex-1">
            Find a Dealer Near You
          </Button>
        </motion.div>
      </section>

      {/* ===== PRODUCT SECTION ===== */}
      <section className="relative py-20 px-5 md:px-12 lg:px-20 bg-gray-50">
        {/* Heading + intro, side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-10 max-w-9xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block text-sm font-semibold tracking-widest text-brand-blue uppercase mb-3">
              Our Solutions
            </span>
            <h2 className="text-4xl text-black md:text-6xl font-bold text-left">
              Your turnkey solutions
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-base text-gray-600 md:text-lg leading-relaxed"
          >
            35 years ago we saw how and where it should be. ELS Phils., Inc., is
            the premiere laundry supplier in the Philippines. We are partnered
            with global and multinational laundry companies, changing the
            industry forward since February 1987.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-9xl mx-auto auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[300px]">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 50 }} // start faded + slightly pushed down
              whileInView={{ opacity: 1, y: 0 }} // animate when scrolled into view
              viewport={{ once: true, amount: 0.2 }} // trigger once when 20% visible
              transition={{ duration: 0.8, delay: i * 0.15 }} // staggered timing
              className={`group relative flex items-center justify-center rounded-lg overflow-hidden shadow-sm
              ${sol.id === 1 ? "md:col-span-2 md:row-span-2 " : "md:col-span-1 md:row-span-1"}`}
            >
              <Link href={sol.href} className="absolute inset-0 z-10" aria-label={sol.title} />

              {sol.image && (
                <Image
                  src={sol.image}
                  alt={sol.title}
                  fill
                  className="rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}

              {/* Gradient scrim + caption — always visible so the label
                  doesn't depend on hover (touch devices included) */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between pointer-events-none">
                <div>
                  <span className="block text-xs font-semibold tracking-widest text-brand-cyan uppercase mb-1">
                    {sol.tag}
                  </span>
                  <h3 className="text-white font-semibold text-base md:text-lg leading-snug">
                    {sol.title}
                  </h3>
                </div>
                <span className="shrink-0 text-white text-lg opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Find a dealer*/}
      <section className="relative py-20 px-5 md:px-12 lg:px-20">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="text-4xl text-black md:text-6xl font-bold text-left mb-10"
        >
          Bringing the industry forward
        </motion.h2>

        {/* Grid of Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Lagoon */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="group relative w-full h-[400px] rounded-lg overflow-hidden"
          >
            <Link href="/quick-links/lagoonP" className="absolute inset-0 z-10" aria-label="Lagoon Showroom" />

            <Image
              src="/assets/lagoon.webp"
              alt="Lagoon commercial laundry showroom"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient scrim + caption — always visible, no hover needed */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
              <span className="block text-xs font-semibold tracking-widest text-brand-cyan uppercase mb-2">
                Lagoon Showroom
              </span>
              <p className="text-white text-base md:text-lg leading-relaxed">
                Experience the showroom showcase of one of the most complete commercial laundry facilities
                in the Philippines. See how additional income can be generated with services your customers need!
              </p>
            </div>
          </motion.div>

          {/* Right column - RBPN */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative w-full h-[400px] rounded-lg overflow-hidden"
          >
            <Link href="/rbpn" className="absolute inset-0 z-10" aria-label="RBPN Dealer Network" />

            <Image
              src="/assets/rbpn.webp"
              alt="Regional Business Partnership Network (RBPN)"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient scrim + caption — always visible, no hover needed */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
              <span className="block text-xs font-semibold tracking-widest text-brand-cyan uppercase mb-2">
                RBPN
              </span>
              <p className="text-white text-base md:text-lg leading-relaxed">
                Interested in becoming an official partner? Be a part of the Regional
                Business Partnership Network (RBPN) — the largest dealership network for
                the laundry industry in the Philippines!
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 w-full max-w-2xl mt-5">
          <Button href="/rbpn" variant="primary" size="lg" className="flex-1">
            Find a Dealer Near You
          </Button>
        </motion.div>
      </section>


      {/* Location section*/}
   <section className="relative py-20 px-5 md:px-12 lg:px-20">
      {/* Section Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="text-4xl text-black md:text-6xl font-bold text-left mb-10"
      >
        At a Glance
      </motion.h2>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: item.id * 0.1 }}
            className="bg-black text-white rounded-2xl p-8 shadow-lg flex flex-col justify-center"
          >
            <h3 className="text-5xl md:text-6xl font-extrabold mb-3">
              {item.number}
            </h3>
            <p className="text-lg leading-relaxed opacity-90">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ===== LOCATIONS ===== */}
    <LocationTabs />
    </main>
  );
}
