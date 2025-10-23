"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FireFightersPage() {
  const benefits = [
    {
      title: "Gear Decontamination",
      description:
        "Removes hazardous residues such as smoke, soot, and chemical contaminants to maintain gear integrity and safety.",
      image: "/images/firefighter-cleaning.jpg",
    },
    {
      title: "Thermal Protection Preservation",
      description:
        "Specialized washing cycles help maintain the protective thermal layers of turnout gear, ensuring compliance with NFPA 1851 standards.",
      image: "/images/firefighter-gear.jpg",
    },
    {
      title: "Efficient Drying Systems",
      description:
        "Rapid, gentle drying systems prevent fabric damage while ensuring gear is ready for the next emergency response.",
      image: "/images/firefighter-drying.jpg",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/firefighters-hero.jpg"
          alt="Firefighter Laundry Hero"
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
            Laundry Solutions for Firefighters
          </motion.h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            Specialized washing and drying systems designed to protect those who
            protect us.
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
          Firefighting gear is exposed to extreme heat, smoke, and hazardous
          chemicals during every operation. Proper laundering is critical to
          preserve safety performance and extend the gear’s lifespan. Our
          high-performance laundry systems are purpose-built for the demands of
          firefighting teams.
        </motion.p>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section className="bg-white w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Key Features & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {benefits.map((item, index) => (
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
      <section className="relative w-full py-20 bg-gradient-to-r from-red-700 to-red-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold mb-4">
            Protecting Heroes, One Wash at a Time
          </h2>
          <p className="mb-8 text-lg">
            Ensure your firefighting team’s safety with our certified laundry
            solutions. Reduce contamination risks and extend gear lifespan with
            every wash.
          </p>
          <button className="bg-white text-red-700 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition">
            Contact Us for Details
          </button>
        </motion.div>
      </section>
    </main>
  );
}

