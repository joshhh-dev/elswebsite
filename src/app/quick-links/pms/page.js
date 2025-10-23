"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PMSPage() {
  const benefits = [
    {
      title: "Maximize Equipment Lifespan",
      description:
        "Regular maintenance reduces wear and tear, extending the lifespan of washers, dryers, and ironers while keeping them running at peak performance.",
      image: "/images/pms-lifespan.jpg",
    },
    {
      title: "Minimize Downtime",
      description:
        "Our scheduled maintenance program identifies and fixes potential issues before they cause breakdowns — ensuring continuous productivity.",
      image: "/images/pms-downtime.jpg",
    },
    {
      title: "Optimize Operational Efficiency",
      description:
        "Well-maintained machines operate more efficiently, consume less energy, and help reduce overall operational costs.",
      image: "/images/pms-efficiency.jpg",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/pms-hero.jpg"
          alt="Preventive Maintenance Program Hero"
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
            Preventive Maintenance Program
          </motion.h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            Keep your laundry operation running efficiently with our
            professional maintenance solutions.
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
          Our Preventive Maintenance Program (PMS) is designed to help your
          business maintain maximum equipment uptime and reliability. By
          scheduling regular inspections and servicing, you reduce costly
          breakdowns and ensure your laundry systems operate efficiently every
          day.
        </motion.p>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section className="bg-white w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Key Benefits of Preventive Maintenance
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
      <section className="relative w-full py-20 bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold mb-4">
            Keep Your Laundry Running at Its Best
          </h2>
          <p className="mb-8 text-lg">
            Enroll in our Preventive Maintenance Program today and experience
            peace of mind with reliable, efficient, and long-lasting laundry
            systems.
          </p>
          <button className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition">
            Contact Us
          </button>
        </motion.div>
      </section>
    </main>
  );
}
