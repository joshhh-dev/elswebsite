"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LagoonPage() {
  const features = [
    {
      title: "Eco-Friendly Wet Cleaning",
      description:
        "Lagoon Advanced Care uses water instead of harsh solvents, offering a sustainable alternative to traditional dry cleaning while ensuring gentle fabric protection.",
      image: "/images/lagoon-eco.jpg",
    },
    {
      title: "Superior Fabric Care",
      description:
        "Specialized wash cycles and delicate drum movement preserve garment texture, shape, and color — ideal for sensitive fabrics like silk, wool, and linen.",
      image: "/images/lagoon-fabric.jpg",
    },
    {
      title: "High Efficiency & Speed",
      description:
        "Shorter processing times and optimized water and energy usage reduce operational costs while maintaining top-quality results.",
      image: "/images/lagoon-efficiency.jpg",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/lagoon-hero.jpg"
          alt="Lagoon Laundry Hero"
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
            Lagoon Advanced Care Systems
          </motion.h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            The only wet-cleaning system approved by Woolmark — combining
            sustainability, performance, and fabric protection.
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
          Lagoon Advanced Care represents a new era of professional cleaning —
          combining environmental responsibility with high performance. Using
          gentle water-based processes, it delivers superior results without the
          use of harmful chemicals, protecting both fabrics and the planet.
        </motion.p>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="bg-white w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Key Advantages of Lagoon Advanced Care
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
      <section className="relative w-full py-20 bg-gradient-to-r from-cyan-700 to-blue-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold mb-4">
            Sustainable Cleaning for a Better Future
          </h2>
          <p className="mb-8 text-lg">
            Join the movement towards eco-responsible garment care with Lagoon
            Advanced Care — combining innovation, performance, and sustainability.
          </p>
          <button className="bg-white text-cyan-700 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition">
            Learn More
          </button>
        </motion.div>
      </section>
    </main>
  );
}
