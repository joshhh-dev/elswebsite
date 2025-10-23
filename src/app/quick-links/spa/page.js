"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SpaGymSalonPage() {
  const features = [
    {
      title: "Hygienic & Fresh Every Time",
      description:
        "Ensure towels, robes, and linens are always sanitized and fresh. Our advanced laundry systems use precise temperature control and disinfection cycles ideal for spas, gyms, and salons.",
      image: "/images/hygienic-fresh.jpg",
    },
    {
      title: "Durable Fabric Care",
      description:
        "Designed to handle high wash volumes while maintaining fabric softness and color integrity — perfect for daily use in wellness and beauty facilities.",
      image: "/images/durable-fabric.jpg",
    },
    {
      title: "Cost-Efficient & Eco-Friendly",
      description:
        "Save on water, energy, and detergent with optimized cycles that reduce operational costs and support sustainability goals.",
      image: "/images/eco-friendly.jpg",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/spa-gym-salon-hero.jpg"
          alt="Spa Gym Salon Laundry Hero"
          fill
          className="object-cover brightness-75"
        />
        <div className="relative z-10 text-center text-black px-6">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Laundry Solutions for Spas, Gyms & Salons
          </motion.h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            Professional laundry systems that deliver superior hygiene,
            efficiency, and fabric care — for wellness, fitness, and beauty
            businesses.
          </p>
        </div>
      </section>

      {/* ===== INTRODUCTION ===== */}
      <section className="max-w-5xl mx-auto px-6 py-16 leading-relaxed text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-lg text-gray-600"
        >
          From luxurious spa towels to gym workout fabrics and salon capes, each
          item demands thorough cleaning, softness, and durability. Our
          commercial laundry systems ensure your linens, uniforms, and fabrics
          remain fresh, sanitized, and comfortable — every single day.
        </motion.p>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="bg-white w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Key Benefits for Spas, Gyms & Salons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-lg"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="relative w-full py-20 bg-gradient-to-r from-teal-700 to-cyan-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold mb-4">
            Clean Comfort, Every Single Time
          </h2>
          <p className="mb-8 text-lg">
            Transform your laundry operations with energy-efficient,
            hygiene-focused solutions designed for spas, gyms, and salons.
          </p>
          <button className="bg-white text-teal-700 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition">
            Learn More
          </button>
        </motion.div>
      </section>
    </main>
  );
}
