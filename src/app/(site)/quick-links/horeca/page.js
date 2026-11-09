"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HorecaPage() {
  const features = [
    {
      title: "High-Volume Performance",
      description:
        "Our commercial washers and dryers are built to handle large loads efficiently — ideal for hotels, resorts, and catering services.",
      image: "/images/hospitality-washer.jpg",
    },
    {
      title: "Delicate Fabric Care",
      description:
        "Advanced wash programs ensure linens, towels, and uniforms remain soft, fresh, and long-lasting with minimal fabric stress.",
      image: "/images/hospitality-fabric.jpg",
    },
    {
      title: "Energy & Water Efficiency",
      description:
        "Our smart systems reduce utility costs with optimized water levels and heat recovery, ensuring sustainability without compromise.",
      image: "/images/hospitality-energy.jpg",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/horeca-hero.jpg"
          alt="Hospitality Laundry Hero"
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
            Laundry Solutions for Hospitality
          </motion.h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            Designed for hotels, restaurants, and catering — where cleanliness
            and comfort meet efficiency.
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
          In the hospitality industry, pristine linens, spotless uniforms, and
          fresh towels are a mark of excellence. Our laundry systems are
          specifically designed to deliver impeccable results — balancing
          performance, sustainability, and reliability to meet the daily demands
          of hotels, restaurants, and catering facilities.
        </motion.p>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="bg-white w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Why Choose Our HORECA Laundry Solutions
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
      <section className="relative w-full py-20 bg-gradient-to-r from-blue-700 to-blue-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold mb-4">
            Elevate Your Guest Experience with Professional Laundry Solutions
          </h2>
          <p className="mb-8 text-lg">
            From boutique hotels to large resorts — ensure your guests enjoy
            spotless comfort with every stay.
          </p>
          <button className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition">
            Contact Us Today
          </button>
        </motion.div>
      </section>
    </main>
  );
}
