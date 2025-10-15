"use client";

import Link from "next/link";
import Header from "./components/Header";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const solutions = [
    {
      id: 1,
      title: "Personal & Commercial Laundry",
      image: "/assets/lg.webp",
      colSpan: "md:row-span-2",
      height: "h-100", // 👈 individual height
      fit: "object-cover", // 👈 individual fit
    },
    {
      id: 2,
      title: "Scarpavapor No Limits",
      image: "/assets/scarpa.webp",
      height: "h-80",
      fit: "object-contain",
    },
    {
      id: 3,
      title: "Laundry Business Management",
      image: "/assets/lms_2.webp",
      height: "h-80",
      fit: "object-contain",
    },
    {
      id: 4,
      title: "lagoon® Advanced Care",
      image: "/assets/lac.webp",
      height: "h-72",
      fit: "object-contain",
    },
    {
      id: 5,
      title: "Professional Laundry Solutions",
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
      {/* ===== HEADER ===== */}
      <Header />

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
          src="/assets/hm_bg.webp"
          alt="Laundry background"
          fill
          priority
          className="object-cover object-center brightness-90 rounded-lg"
        />
      </motion.div>


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
          <Link
            href="/about"
            className="flex-1 text-center px-12 py-6 text-xl font-semibold bg-white text-black rounded-xl shadow-lg hover:scale-105 hover:bg-gray-200 transition-transform"
          >
            About Us
          </Link>
          <Link
            href="/rbpn"
            className="flex-1 text-center px-12 py-6 text-xl font-semibold bg-white text-black rounded-xl shadow-lg hover:scale-105 hover:bg-gray-200 transition-transform"
          >
            Find a Dealer Near You
          </Link>
        </motion.div>
      </section>

      {/* ===== PRODUCT SECTION ===== */}
      <section className="'flex-1 relative py-20 px-5 md:px-12 lg:px-20 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{once:true, amount:0.2}}
          transition={{ duration: 1 }}
          className="text-4xl text-black md:text-6xl font-bold text-left mb-10"
        >
          Your turnkey solutions
        </motion.h2>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-9xl mx-auto auto-rows-[300px]">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 50 }} // start faded + slightly pushed down
              whileInView={{ opacity: 1, y: 0 }} // animate when scrolled into view
              viewport={{ once: true, amount: 0.2 }} // trigger once when 20% visible
              transition={{ duration: 0.8, delay: i * 0.15 }} // staggered timing
              className={`relative flex items-center justify-center rounded-lg overflow-hidden
              ${sol.id === 1 ? "md:col-span-2 md:row-span-2 " : "md:col-span-1 md:row-span-1"}`}
            >
              {sol.image && (
                <Image
                  src={sol.image}
                  alt={sol.title}
                  fill
                  className={`rounded-lg object-cover`}
                />
              )}
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }} // animate when scrolled into view
          viewport={{ once: true, amount: 0.2 }} // trigger once when 20% visible
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg text-black md:text-xl max-w-9xl leading-relaxed"
        >
          35 years ago we saw how and where it should be. 
          ELS Phils., Inc., is the premiere laundry supplier in the Philippines. 
          We are partnered and applied from global and multinational laundry companies that created the existing laundry methods, materials, procedures, technologies, 
          and skills, that are changing the laundry industry forward, that until now, is being made better since February 1987.
        </motion.p>
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
            className="relative w-full h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/assets/lagoon.webp"
              alt="Lagoon commercial laundry showroom"
              fill
              priority
              className="object-cover"
            />
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileHover={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="absolute bottom-6 text-black left-6 right-6 bg-white/80 p-4 rounded-lg text-lg md:text-xl leading-relaxed z-10"
            >
              Experience the showroom showcase of one of the most complete commercial laundry facilities 
              in the Philippines. See how additional income can be generated with services your customers need!
            </motion.p>
          </motion.div>

          {/* Right column - RBPN */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/assets/rbpn.webp"
              alt="Regional Business Partnership Network (RBPN)"
              fill
              priority
              className="object-cover"
            />
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileHover={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="absolute bottom-6 text-black left-6 right-6 bg-white/80 p-4 rounded-lg text-lg md:text-xl leading-relaxed z-10"
            >
              Interested in becoming an official partner? Be a part of the Regional
              Business Partnership Network (RBPN) — the largest dealership network for
              the laundry industry in the Philippines!
            </motion.p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 w-full max-w-2xl mt-5">
          <Link
            href="/rbpn"
            className="flex-1 rounded-xl text-center px-12 py-6 text-xl font-semibold bg-blue-900 text-whiterounded-xl shadow-lg hover:scale-105 hover:bg-blue-500 transition-transform"
          >
            Find a Dealer Near You
          </Link>
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

    {/*Location Section*/}
<section className="relative py-20 px-5 md:px-12 lg:px-20 bg-white">
  <h1 className="text-5xl font-bold text-black mb-10">Headquarters</h1>
  <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4504048530343!2d121.04711337593516!3d14.604489077615018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7dbd8535953%3A0xbc4d300e59b70335!2sELS%20Philippines%20Inc.!5e0!3m2!1sen!2sph!4v1728200212345!5m2!1sen!2sph"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
  </section>

  <section className="relative py-20 px-5 md:px-12 lg:px-20 bg-white">
    <h1 className="text-5xl font-bold text-black mb-12">lagoon® Training Facility - CTCC Office</h1>
  <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.683656330788!2d121.1128500745722!3d14.560074178068666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c7e1fc349dcd%3A0xb082ad84347e64dd!2sLagoon%20-%20Clean%20Tech%20Concept%20Corp.!5e0!3m2!1sen!2sph!4v1759797976629!5m2!1sen!2sph"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
  </section>

  <section className="relative py-20 px-5 md:px-12 lg:px-20 bg-white">
    <h1 className="text-5xl font-bold text-black mb-10">Mega Warehouse</h1>
  <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1930.7909017894854!2d121.12130849481277!3d14.565891201863083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c73bf8adf8bf%3A0x8cfc3dad2f82f79a!2s888%20Industrial%20Megacity!5e0!3m2!1sen!2sph!4v1759798155257!5m2!1sen!2sph"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
  </section>

<>
<Footer/>
</>
    </main>
  );
}
